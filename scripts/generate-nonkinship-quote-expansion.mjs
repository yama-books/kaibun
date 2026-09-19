import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const growth=readJson("data/growth-engine-v10.json");
const fixture=readJson("data/nonkinship-quote-expansion-v87.json");

const sourceIds=["event-horse-dance","event-chase","event-call","event-seed-sleep"];
const baseWrappers=["say-topic","hear-topic","state-topic","narrate-topic","judge-topic","interpret-topic","hear-kuki","know-rushi","ack-topic","tell-topic","reply-topic","read-muyo-topic","state-rubeno-topic","write-topic"];
const starts=[0,3,6,9];
const quoteMarks=[["「","」"],["『","』"],["〈","〉"],["《","》"],["【","】"],["〔","〕"],["［","］"],["（","）"],["〝","〟"]];
const wrappers=new Map((growth.sentence_level_wrappers??[]).map(w=>[w.id,w]));
const rev=s=>[...s].reverse().join("");
const isPal=s=>s===rev(s);
const strip=t=>t?.endsWith("。")?t.slice(0,-1):t;

const errors=[];
const generated=[];

for(let si=0;si<sourceIds.length;si++){
  const sid=sourceIds[si];
  const src=(growth.narrative_families??[]).find(f=>f.id===sid);
  if(!src){errors.push("missing source "+sid);continue}
  const base=src.stages?.[1];
  if(!base){errors.push("missing source stage1 "+sid);continue}
  if(/[母父]/.test(base.display??""))errors.push("source stage contains kinship "+sid);

  const seq=[];
  for(let k=0;k<9;k++)seq.push(baseWrappers[(starts[si]+k)%baseWrappers.length]);

  let cur={
    reading:base.reading,display:base.display,adds:"親族化前の引用核",
    japanese_quality:base.japanese_quality,weirdness:base.weirdness,
    dimension:"引用・伝聞",wrapper_depth:0
  };
  const stages=[cur];

  for(let i=0;i<seq.length;i++){
    const w=wrappers.get(seq[i]);
    if(!w){errors.push("missing wrapper "+seq[i]);break}
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
      reading,display,adds:"文レベル外枠："+w.semantic,
      japanese_quality:depth>=6?"C":(depth>=3?"B":(w.quality||"B+")),
      weirdness:Math.max(w.weirdness_floor||3,Math.min(5,2+depth)),
      dimension:"引用・伝聞",wrapper_depth:depth,wrapper_id:w.id,wrapper_outer_lexemes:w.outer_lexemes||[]
    };
    stages.push(cur);
  }

  generated.push({
    id:`report-simple-${sid.replace(/^event-/,"")}`,
    label:`引用：${src.label.replace(/^出来事：/,"")}（親族化前）`,
    layer:"L2",dimension:"引用・伝聞",mode:"research_generated_stages",
    source_family:sid,source_stage:1,collision_policy:"outer nouns must not repeat inside/outside",
    wrapper_order:"v0.72-compatible rotated sequence",wrapper_sequence:seq,stages
  });
}

if(fixture.version!=="0.87.1")errors.push(`fixture version ${fixture.version}, expected 0.87.1`);
if((fixture.families??[]).length!==4)errors.push("fixture family count must be 4");
if(fixture.generated_stage_count!==40)errors.push("fixture stage count must be 40");
if(new Set(fixture.first_wrapper_ids??[]).size!==4)errors.push("first wrappers must be distinct across four prototype families");

const fixtureById=new Map((fixture.families??[]).map(f=>[f.id,f]));
for(const fam of generated){
  const prev=fixtureById.get(fam.id);
  if(!prev){errors.push("missing fixture family "+fam.id);continue}
  if(prev.source_family!==fam.source_family||prev.source_stage!==fam.source_stage)errors.push("source drift "+fam.id);
  if(JSON.stringify(prev.wrapper_sequence)!==JSON.stringify(fam.wrapper_sequence))errors.push("wrapper sequence drift "+fam.id);
  if((prev.stages??[]).length!==fam.stages.length)errors.push("stage count drift "+fam.id);
  fam.stages.forEach((st,i)=>{
    if(!isPal(st.reading))errors.push(`non-palindrome ${fam.id} stage ${i}`);
    if(/[母父]/.test(st.display??""))errors.push(`kinship leaked ${fam.id} stage ${i}`);
    const old=prev.stages?.[i];
    if(!old||old.reading!==st.reading)errors.push(`reading drift ${fam.id} stage ${i}`);
    if(!old||old.display!==st.display)errors.push(`display drift ${fam.id} stage ${i}`);
    if(old?.wrapper_id!==st.wrapper_id)errors.push(`wrapper drift ${fam.id} stage ${i}`);
  });
}

const currentStageCount=(growth.narrative_families??[]).reduce((n,f)=>n+(f.stages??[]).length,0);
const currentKin=(growth.narrative_families??[]).reduce((n,f)=>n+(f.stages??[]).filter(s=>/[母父]/.test(s.display??"")||s.extension_type==="kinship_recipient").length,0);
const projected=currentKin/(currentStageCount+40);
if(currentStageCount!==322)errors.push(`current stage count ${currentStageCount}, expected 322`);
if(currentKin!==216)errors.push(`current kinship stage count ${currentKin}, expected 216`);
if(projected>=0.60)errors.push(`projected kinship share ${projected} must be <0.60 when all 40 research stages are counted`);

if(errors.length){
  console.error("Non-kinship quote expansion validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: non-kinship quote expansion v87.1");
console.log(`Families=4, stages=40, first wrappers=${fixture.first_wrapper_ids.join(",")}`);
