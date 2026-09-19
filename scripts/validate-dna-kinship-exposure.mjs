import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const rules=readJson("data/generation-rules-v08.json");
const pairs=readJson("data/reverse-lexeme-pairs-v09.json");
const policy=readJson("data/dna-kinship-exposure-policy-v84.json");

const rev=s=>[...s].reverse().join("");
const isPal=s=>s===rev(s);
const layer="L1", maxWeird=2;
const defaultWeird=l=>l==="L1"?1:l==="L2"?3:4;

function variantLayer(rule,v){
  if(v&&["L1","L2","L3"].includes(v[2]))return v[2];
  if((rule.layer||"").includes("/"))return null;
  return rule.layer;
}
function push(out,rule,reading,l,weirdness,kind){
  const w=weirdness??rule.weirdness??defaultWeird(l);
  if(l!==layer||!isPal(reading)||w>maxWeird)return;
  out.push({reading,kind});
}
function recursiveNPs(rule,maxDepth){
  const levels=[rule.bases.map(x=>({...x,depth:0}))];
  for(let d=1;d<=Math.min(maxDepth,rule.max_depth);d++){
    const cur=[];
    for(const w of rule.wrappers)for(const inner of levels[d-1]){
      if(rule.constraints?.no_same_adjacent_relation&&w.reading===inner.edge)continue;
      cur.push({reading:w.reading+"の"+inner.reading+"の"+w.reading,depth:d,edge:w.reading});
    }
    levels.push(cur);
  }
  return levels.flat();
}
function unique(arr){
  const m=new Map();
  for(const x of arr)if(!m.has(x.reading))m.set(x.reading,x);
  return [...m.values()];
}

const standard=[];
for(const rule of rules.rules??[]){
  if(rule.type==="recursive_kinship")continue;
  if(rule.type==="fixed"){push(standard,rule,rule.reading,rule.layer,null,"standard");continue}
  if(rule.type==="particle_pair"){
    for(const v of rule.variants??[])push(standard,rule,rule.left+v[0]+rule.right,rule.layer,null,"standard");
    continue;
  }
  if(rule.type==="mirrored_coordination"){
    for(const v of rule.variants??[])push(standard,rule,rule.reading_pattern.replace("{person}",v[0]),rule.layer,null,"standard");
    continue;
  }
  for(const v of rule.variants??[]){
    const l=variantLayer(rule,v)||(rule.layer||"").split("/")[0];
    let reading=rule.reading_pattern??"";
    if(reading.includes("{c}"))reading=reading.replace("{c}",v[0]);
    if(reading.includes("{pal_center}"))reading=reading.replace("{pal_center}",v[0]);
    push(standard,rule,reading,l,null,"standard");
  }
}

const pair=[];
for(const p of pairs.pairs??[]){
  if(p.right.reading!==rev(p.left.reading))continue;
  for(const v of p.variants??[]){
    if(v.layer!==layer||v.weirdness>maxWeird)continue;
    const reading=p.left.reading+v.particle+p.right.reading;
    if(isPal(reading))pair.push({reading,kind:"pair"});
  }
}

const recursive=[];
for(const rule of (rules.rules??[]).filter(r=>r.type==="recursive_kinship")){
  for(const np of recursiveNPs(rule,1)){
    const w=rule.weirdness_by_depth?.[np.depth]??(1+np.depth);
    for(const frame of rule.frames??[])push(recursive,rule,frame.left+np.reading+frame.right,rule.layer,w,"recursive");
  }
}

const standardU=unique(standard),pairU=unique(pair),recursiveU=unique(recursive);
const all=unique([...standardU,...pairU,...recursiveU]);
const recursiveReadings=new Set(recursiveU.map(x=>x.reading));
const recursiveInAll=all.filter(x=>recursiveReadings.has(x.reading));
const otherInAll=all.filter(x=>!recursiveReadings.has(x.reading));

const errors=[];
if(policy.version!=="0.84")errors.push(`policy version ${policy.version}, expected 0.84`);
if(policy.policy?.recursive_probability_cap!==0.25)errors.push("recursive cap must be 0.25");
if(all.length!==451)errors.push(`L1 dnaPool total ${all.length}, expected 451`);
if(recursiveInAll.length!==216)errors.push(`recursive reading count ${recursiveInAll.length}, expected 216`);
if(otherInAll.length!==235)errors.push(`nonrecursive selected-pool count ${otherInAll.length}, expected 235`);
const share=recursiveInAll.length/all.length;
if(Math.abs(share-0.4789356984478936)>1e-12)errors.push(`recursive share drift ${share}`);
if(policy.policy?.recursive_probability_cap>=share)errors.push("cap no longer throttles current natural share");

if(errors.length){
  console.error("DNA kinship exposure validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log(`OK: L1 DNA pool=${all.length}, recursive=${recursiveInAll.length} (${(share*100).toFixed(1)}%), cap=${policy.policy.recursive_probability_cap*100}%`);
