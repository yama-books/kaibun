import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const growth=readJson("data/growth-engine-v10.json");
const rollout=readJson("data/nonkinship-growth-rollout-v90.json");
const quote=readJson("data/nonkinship-quote-expansion-v87.json");
const quoteCuration=readJson("data/nonkinship-quote-curation-v88.json");
const reaction=readJson("data/nonkinship-reaction-expansion-v89.json");

const rev=s=>[...s].reverse().join("");
const isPal=s=>s===rev(s);
const errors=[];

if(growth.version!=="0.31")errors.push(`growth version ${growth.version}, expected 0.31`);
if(rollout.version!=="0.90")errors.push(`rollout version ${rollout.version}, expected 0.90`);
if(quote.version!=="0.87.1")errors.push(`quote prototype version ${quote.version}, expected 0.87.1`);
if(quoteCuration.version!=="0.88")errors.push(`quote curation version ${quoteCuration.version}, expected 0.88`);
if(reaction.version!=="0.89")errors.push(`reaction prototype version ${reaction.version}, expected 0.89`);

const fams=growth.narrative_families??[];
const byId=new Map(fams.map(f=>[f.id,f]));
const stageCount=fams.reduce((n,f)=>n+(f.stages??[]).length,0);
const kinshipCount=fams.reduce((n,f)=>n+(f.stages??[]).filter(s=>/[母父]/.test(s.display??"")||s.extension_type==="kinship_recipient").length,0);
const kinshipShare=kinshipCount/stageCount;

if(fams.length!==53)errors.push(`family count ${fams.length}, expected 53`);
if(stageCount!==366)errors.push(`stage count ${stageCount}, expected 366`);
if(kinshipCount!==216)errors.push(`kinship stage count ${kinshipCount}, expected 216`);
if(Math.abs(kinshipShare-(216/366))>1e-12)errors.push(`kinship share drift ${kinshipShare}`);
if(kinshipShare>=0.60)errors.push(`kinship share ${kinshipShare} must remain below 0.60`);

const publicReportIds=(quote.families??[]).map(f=>f.id);
const publicReactionIds=(reaction.families??[]).map(f=>f.id);
if(new Set(publicReportIds).size!==4||new Set(publicReactionIds).size!==4)errors.push("rollout family ids must be unique");

const quoteById=new Map((quote.families??[]).map(f=>[f.id,f]));
for(const id of publicReportIds){
  const pub=byId.get(id),src=quoteById.get(id);
  if(!pub){errors.push("missing public report family "+id);continue}
  if((pub.stages??[]).length!==6)errors.push(`public report stages ${id}: ${pub.stages?.length}, expected 6`);
  if(pub.mode!=="curated_full_stages")errors.push("public report mode not curated "+id);
  for(let i=0;i<(pub.stages??[]).length;i++){
    const st=pub.stages[i],orig=src?.stages?.[i];
    if(!orig||st.reading!==orig.reading||st.display!==orig.display)errors.push(`report fixture drift ${id} stage ${i}`);
    if(!isPal(st.reading))errors.push(`report non-palindrome ${id} stage ${i}`);
    if(/[母父]/.test(st.display??""))errors.push(`report kinship leak ${id} stage ${i}`);
    if(st.japanese_quality==="C")errors.push(`C-quality report leaked public ${id} stage ${i}`);
  }
}

const reactionById=new Map((reaction.families??[]).map(f=>[f.id,f]));
for(const id of publicReactionIds){
  const pub=byId.get(id),src=reactionById.get(id);
  if(!pub){errors.push("missing public reaction family "+id);continue}
  if((pub.stages??[]).length!==5)errors.push(`public reaction stages ${id}: ${pub.stages?.length}, expected 5`);
  if(pub.mode!=="curated_full_stages")errors.push("public reaction mode not curated "+id);
  for(let i=0;i<(pub.stages??[]).length;i++){
    const st=pub.stages[i],orig=src?.stages?.[i];
    if(!orig||st.reading!==orig.reading||st.display!==orig.display)errors.push(`reaction fixture drift ${id} stage ${i}`);
    if(!isPal(st.reading))errors.push(`reaction non-palindrome ${id} stage ${i}`);
    if(/[母父]/.test(st.display??""))errors.push(`reaction kinship leak ${id} stage ${i}`);
    if(st.japanese_quality==="C")errors.push(`C-quality reaction leaked public ${id} stage ${i}`);
  }
}

for(const f of quote.families??[]){
  const pub=byId.get(f.id);
  for(const held of (f.stages??[]).filter(s=>(s.wrapper_depth??0)>=6)){
    if((pub?.stages??[]).some(s=>s.reading===held.reading))errors.push(`held deep quote stage leaked: ${f.id} depth ${held.wrapper_depth}`);
  }
}

const fixedQuotes=fams.filter(f=>f.id.startsWith("quote-"));
const firstDiversity=new Set(fixedQuotes.map(f=>f.stages?.[1]?.wrapper_id).filter(Boolean)).size;
if(fixedQuotes.length!==18)errors.push(`legacy fixed quote count ${fixedQuotes.length}, expected 18`);
if(firstDiversity!==18)errors.push(`legacy first-wrapper diversity ${firstDiversity}, expected 18`);

const firstNew=new Set(publicReportIds.map(id=>byId.get(id)?.stages?.[1]?.wrapper_id).filter(Boolean));
if(firstNew.size!==4)errors.push(`new report first-wrapper diversity ${firstNew.size}, expected 4`);

if(growth.verified?.narrative_family_count!==53)errors.push("verified narrative family count mismatch");
if(growth.verified?.narrative_variants!==366)errors.push("verified narrative variant count mismatch");
if(growth.verified?.nonkinship_rollout_family_count!==8)errors.push("verified rollout family count mismatch");
if(growth.verified?.nonkinship_rollout_stage_count!==44)errors.push("verified rollout stage count mismatch");
if(growth.verified?.kinship_stage_count!==216)errors.push("verified kinship stage count mismatch");
if(Math.abs((growth.verified?.kinship_stage_share??1)-(216/366))>1e-12)errors.push("verified kinship share mismatch");

if(errors.length){
  console.error("Non-kinship growth rollout validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: non-kinship growth rollout v90");
console.log(`Families=53, stages=366, kinship=${kinshipCount} (${(kinshipShare*100).toFixed(1)}%)`);
console.log(`Added reports=24 stages, reactions=20 stages; held deep quote stages=16`);
