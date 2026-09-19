import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data=readJson("data/layered-seeds-v08.json");
const rules=readJson("data/generation-rules-v08.json");
const pairs=readJson("data/reverse-lexeme-pairs-v09.json");
const seams=readJson("data/seam-grammar-v25.json");
const bridge=readJson("data/modern-bridge-public-v69.json");
const policy=readJson("data/ten-comparison-balance-policy-v86.json");

const rev=s=>[...s].reverse().join("");
const isPal=s=>s===rev(s);
const layer="L1",maxWeird=2;
const defaultWeird=l=>l==="L1"?1:l==="L2"?3:4;
const unique=arr=>{const m=new Map();for(const x of arr)if(x?.reading&&!m.has(x.reading))m.set(x.reading,x);return [...m.values()]};

function variantLayer(rule,v){
  if(v&&["L1","L2","L3"].includes(v[2]))return v[2];
  if((rule.layer||"").includes("/"))return null;
  return rule.layer;
}
function push(out,rule,display,reading,l,weirdness,kind){
  const w=weirdness??rule.weirdness??defaultWeird(l);
  if(l!==layer||!isPal(reading)||w>maxWeird)return;
  out.push({display,reading,kind,origin:rule.id,weirdness:w});
}
function recursiveNPs(rule,maxDepth){
  const levels=[rule.bases.map(x=>({...x,depth:0}))];
  for(let d=1;d<=Math.min(maxDepth,rule.max_depth);d++){
    const cur=[];
    for(const w of rule.wrappers)for(const inner of levels[d-1]){
      if(rule.constraints?.no_same_adjacent_relation&&w.reading===inner.edge)continue;
      cur.push({reading:w.reading+"の"+inner.reading+"の"+w.reading,display:w.display+"の"+inner.display+"の"+w.display,depth:d,edge:w.reading});
    }
    levels.push(cur);
  }
  return levels.flat();
}

const recursive=[];
for(const rule of (rules.rules??[]).filter(r=>r.type==="recursive_kinship")){
  for(const np of recursiveNPs(rule,1)){
    const w=rule.weirdness_by_depth?.[np.depth]??(1+np.depth);
    for(const fr of rule.frames??[])push(recursive,rule,fr.display.replace("{np}",np.display),fr.left+np.reading+fr.right,rule.layer,w,"recursive");
  }
}
const recursiveU=unique(recursive);
const recursiveReadings=new Set(recursiveU.map(x=>x.reading));

const dna=[];
for(const rule of rules.rules??[]){
  if(rule.type==="recursive_kinship")continue;
  if(rule.type==="fixed"){push(dna,rule,rule.display,rule.reading,rule.layer,null,"dna");continue}
  if(rule.type==="particle_pair"){
    for(const v of rule.variants??[])push(dna,rule,v[1],rule.left+v[0]+rule.right,rule.layer,null,"dna");
    continue;
  }
  if(rule.type==="mirrored_coordination"){
    for(const v of rule.variants??[])push(dna,rule,v[1],rule.reading_pattern.replace("{person}",v[0]),rule.layer,null,"dna");
    continue;
  }
  for(const v of rule.variants??[]){
    const l=variantLayer(rule,v)||(rule.layer||"").split("/")[0];
    let reading=rule.reading_pattern??"";
    if(reading.includes("{c}"))reading=reading.replace("{c}",v[0]);
    if(reading.includes("{pal_center}"))reading=reading.replace("{pal_center}",v[0]);
    push(dna,rule,v[1],reading,l,null,"dna");
  }
}
for(const p of pairs.pairs??[]){
  if(p.right.reading!==rev(p.left.reading))continue;
  for(const v of p.variants??[]){
    if(v.layer!==layer||v.weirdness>maxWeird)continue;
    const reading=p.left.reading+v.particle+p.right.reading;
    if(isPal(reading))dna.push({display:p.left.display+v.particle+(v.right_display||p.right.display)+"。",reading,kind:"pair",origin:"PAIR:"+p.id,weirdness:v.weirdness});
  }
}
dna.push(...recursiveU);
const dnaU=unique(dna);

const seedU=unique((data.records??[])
  .filter(x=>x.layer===layer&&(x.weirdness??defaultWeird(x.layer))<=maxWeird)
  .map(x=>({...x,kind:"seed",origin:"原種"})));

const seamU=unique([
  ...(seams.recipes??[]).filter(r=>r.layer===layer&&(r.weirdness??1)<=maxWeird).map(r=>({...r,kind:"seam"})),
  ...(bridge.candidates??[]).filter(r=>r.layer===layer&&(r.weirdness??1)<=maxWeird).map(r=>({...r,kind:"bridge"}))
]);

const nonrecursive=x=>!recursiveReadings.has(x.reading);
const strata={
  "seed-nonrecursive":seedU.filter(nonrecursive),
  "nonrecursive-dna":dnaU.filter(nonrecursive),
  "recursive-kinship":dnaU.filter(x=>recursiveReadings.has(x.reading)),
  "seam-and-bridge-nonrecursive":seamU.filter(nonrecursive)
};
const combined=unique([...seedU,...dnaU,...seamU]);

const errors=[];
if(policy.version!=="0.86.1")errors.push(`policy version ${policy.version}, expected 0.86.1`);
if(combined.length!==489)errors.push(`combined L1 comparison pool ${combined.length}, expected 489`);
if(recursiveReadings.size!==216)errors.push(`recursive reading set ${recursiveReadings.size}, expected 216`);
const recCombined=combined.filter(x=>recursiveReadings.has(x.reading)).length;
if(recCombined!==216)errors.push(`recursive readings in combined pool ${recCombined}, expected 216`);

for(const q of policy.quotas??[]){
  const available=strata[q.id]?.length??0;
  if(available<q.count)errors.push(`insufficient stratum ${q.id}: ${available}<${q.count}`);
}
const quotaTotal=(policy.quotas??[]).reduce((n,q)=>n+(q.count??0),0);
if(quotaTotal!==10)errors.push(`quota total ${quotaTotal}, expected 10`);
const recursiveQuota=(policy.quotas??[]).find(q=>q.id==="recursive-kinship")?.count;
if(recursiveQuota!==2)errors.push(`recursive quota ${recursiveQuota}, expected 2`);

if(errors.length){
  console.error("Ten-item comparison balance validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: ten-item comparison balance");
console.log(JSON.stringify(Object.fromEntries(Object.entries(strata).map(([k,v])=>[k,v.length]))));
console.log(`Combined=${combined.length}, recursive=${recCombined} (${(recCombined/combined.length*100).toFixed(1)}%), displayed recursive quota=2/10`);
