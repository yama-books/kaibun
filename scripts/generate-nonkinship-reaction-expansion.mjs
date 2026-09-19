import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const growth=readJson("data/growth-engine-v10.json");
const fixture=readJson("data/nonkinship-reaction-expansion-v89.json");
const quoteCuration=readJson("data/nonkinship-quote-curation-v88.json");

const sourceIds=["event-horse-dance","event-chase","event-call","event-seed-sleep"];
const wrapperIds=["react-cry","react-troubled","react-silent","react-laugh"];
const quoteMarks=[["「","」"],["『","』"],["〈","〉"],["《","》"]];
const wrappers=new Map((growth.sentence_level_wrappers??[]).map(w=>[w.id,w]));
const rev=s=>[...s].reverse().join("");
const isPal=s=>s===rev(s);
const strip=t=>t?.endsWith("。")?t.slice(0,-1):t;
const errors=[];
const generated=[];

for(const sid of sourceIds){
  const src=(growth.narrative_families??[]).find(f=>f.id===sid);
  if(!src){errors.push("missing source "+sid);continue}
  const base=src.stages?.[1];
  if(!base){errors.push("missing source stage1 "+sid);continue}
  if(/[母父]/.test(base.display??""))errors.push("source stage contains kinship "+sid);

  let cur={
    reading:base.reading,display:base.display,adds:"反応する非親族の元文",
    japanese_quality:base.japanese_quality,weirdness:base.weirdness,
    dimension:"反応",wrapper_depth:0
  };
  const stages=[cur];

  for(let i=0;i<wrapperIds.length;i++){
    const w=wrappers.get(wrapperIds[i]);
    if(!w){errors.push("missing wrapper "+wrapperIds[i]);break}
    if(rev(w.left_reading)!==w.right_reading)errors.push("wrapper reverse mismatch "+w.id);
    for(const l of w.outer_lexemes??[]){
      if((l.display&&String(cur.display??"").includes(l.display))||(l.reading&&String(cur.reading??"").includes(l.reading))){
        errors.push(`lexeme collision ${sid}/${w.id}/${l.display}`);
      }
    }
    const depth=i+1,q=quoteMarks[i];
    const reading=w.left_reading+cur.reading+w.right_reading;
    const display=w.left_display+q[0]+strip(cur.display)+q[1]+w.right_display;
    cur={
      reading,display,adds:w.semantic,
      japanese_quality:depth>=3?"B":(w.quality||"B"),
      weirdness:Math.max(w.weirdness_floor||4,Math.min(5,2+depth)),
      dimension:"反応",wrapper_depth:depth,wrapper_id:w.id,wrapper_outer_lexemes:w.outer_lexemes||[]
    };
    stages.push(cur);
  }

  generated.push({
    id:`reaction-simple-${sid.replace(/^event-/,"")}`,
    label:`反応：${src.label.replace(/^出来事：/,"")}（親族化前）`,
    layer:"L2",dimension:"反応",mode:"research_generated_stages",
    source_family:sid,source_stage:1,collision_policy:"outer nouns must not repeat inside/outside",
    wrapper_order:"reaction sequence",stages
  });
}

if(fixture.version!=="0.89")errors.push(`fixture version ${fixture.version}, expected 0.89`);
if(quoteCuration.version!=="0.88")errors.push(`quote curation version ${quoteCuration.version}, expected 0.88`);
if((fixture.families??[]).length!==4)errors.push("fixture family count must be 4");
if(fixture.generated_stage_count!==20)errors.push("fixture stage count must be 20");
if(JSON.stringify(fixture.wrapper_sequence)!==JSON.stringify(wrapperIds))errors.push("reaction wrapper sequence drift");

const fixtureById=new Map((fixture.families??[]).map(f=>[f.id,f]));
for(const fam of generated){
  const prev=fixtureById.get(fam.id);
  if(!prev){errors.push("missing fixture family "+fam.id);continue}
  if(prev.source_family!==fam.source_family||prev.source_stage!==fam.source_stage)errors.push("source drift "+fam.id);
  fam.stages.forEach((st,i)=>{
    if(!isPal(st.reading))errors.push(`non-palindrome ${fam.id} stage ${i}`);
    if(/[母父]/.test(st.display??""))errors.push(`kinship leaked ${fam.id} stage ${i}`);
    const old=prev.stages?.[i];
    if(!old||old.reading!==st.reading)errors.push(`reading drift ${fam.id} stage ${i}`);
    if(!old||old.display!==st.display)errors.push(`display drift ${fam.id} stage ${i}`);
    if(old?.wrapper_id!==st.wrapper_id)errors.push(`wrapper drift ${fam.id} stage ${i}`);
  });
}

const acceptedQuoteStages=quoteCuration.summary?.accepted_stages??0;
const projection=fixture.combined_projection??{};
if(projection.current_stage_count!==322)errors.push(`fixture baseline stage count ${projection.current_stage_count}, expected 322`);
if(projection.current_kinship_stage_count!==216)errors.push(`fixture baseline kinship count ${projection.current_kinship_stage_count}, expected 216`);
if(acceptedQuoteStages!==24)errors.push(`accepted quote stages ${acceptedQuoteStages}, expected 24`);
if(projection.reaction_stages!==20)errors.push(`reaction stage count ${projection.reaction_stages}, expected 20`);
if(projection.projected_stage_count!==366)errors.push(`projected stage count ${projection.projected_stage_count}, expected 366`);
if((projection.projected_kinship_share??1)>=0.60)errors.push(`combined projected kinship share ${projection.projected_kinship_share} must be <0.60`);

if(errors.length){
  console.error("Non-kinship reaction expansion validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: non-kinship reaction expansion v89");
console.log(`Families=4, stages=20, combined projected kinship share=${(projected*100).toFixed(1)}%`);
