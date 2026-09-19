import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const data=readJson("data/layered-seeds-v08.json");
const rules=readJson("data/generation-rules-v08.json");
const pairs=readJson("data/reverse-lexeme-pairs-v09.json");
const seams=readJson("data/seam-grammar-v25.json");
const bridge=readJson("data/modern-bridge-public-v69.json");
const policy=readJson("data/l2-ten-comparison-policy-v93.json");

const rev=s=>[...s].reverse().join("");
const isPal=s=>s===rev(s);
const layer="L2",maxWeird=3;
const defaultWeird=l=>l==="L1"?1:l==="L2"?3:4;
const unique=arr=>{const m=new Map();for(const x of arr)if(x?.reading&&!m.has(x.reading))m.set(x.reading,x);return [...m.values()]};

function variantLayer(rule,v){
  if(v&&["L1","L2","L3"].includes(v[2]))return v[2];
  if((rule.layer||"").includes("/"))return null;
  return rule.layer;
}
function push(out,rule,display,reading,l,weirdness,source,origin){
  const w=weirdness??rule.weirdness??defaultWeird(l);
  if(l!==layer||!isPal(reading)||w>maxWeird)return;
  out.push({display,reading,source,origin:origin||rule.id,family:rule.family??null,weirdness:w});
}

const seed=(data.records??[])
  .filter(x=>x.layer===layer&&(x.weirdness??defaultWeird(x.layer))<=maxWeird)
  .map(x=>({...x,source:"seed",origin:x.id}));

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
    if(isPal(reading))dna.push({display:p.left.display+v.particle+(v.right_display||p.right.display)+"。",reading,source:"pair",origin:p.id,weirdness:v.weirdness});
  }
}

const seam=(seams.recipes??[]).filter(r=>r.layer===layer&&(r.weirdness??1)<=maxWeird).map(r=>({...r,source:"seam",origin:r.id}));
const bridgePool=(bridge.candidates??[]).filter(r=>r.layer===layer&&(r.weirdness??1)<=maxWeird).map(r=>({...r,source:"bridge",origin:r.id}));
const combined=unique([...seed,...dna,...seam,...bridgePool]);

const family=policy.rule?.capped_family;
const cap=policy.rule?.max_items;
const identity=combined.filter(x=>x.family===family);
const other=combined.filter(x=>x.family!==family);

function deterministicRepair(items){
  let usedFamily=0;
  const kept=[];
  for(const x of items){
    if(x.family===family){
      if(usedFamily>=cap)continue;
      usedFamily++;
    }
    kept.push(x);
  }
  const used=new Set(kept.map(x=>x.reading));
  for(const x of other){
    if(kept.length>=items.length)break;
    if(used.has(x.reading))continue;
    used.add(x.reading);kept.push(x);
  }
  return kept;
}

const errors=[];
if(policy.version!=="0.93")errors.push(`policy version ${policy.version}, expected 0.93`);
if(family!=="同定")errors.push(`capped family ${family}, expected 同定`);
if(cap!==2)errors.push(`cap ${cap}, expected 2`);
if(combined.length!==62)errors.push(`L2 combined pool ${combined.length}, expected 62`);
if(identity.length!==13)errors.push(`identity count ${identity.length}, expected 13`);
if(other.length!==49)errors.push(`non-identity count ${other.length}, expected 49`);

const worst=deterministicRepair(identity.slice(0,10));
if(worst.length!==10)errors.push(`worst-case repaired length ${worst.length}, expected 10`);
if(new Set(worst.map(x=>x.reading)).size!==10)errors.push("worst-case repair contains duplicate readings");
if(worst.filter(x=>x.family===family).length>2)errors.push("worst-case repair exceeds identity cap");

const alreadyBalanced=[...identity.slice(0,2),...other.slice(0,8)];
const balanced=deterministicRepair(alreadyBalanced);
if(balanced.length!==10)errors.push("balanced sample length changed");
if(balanced.filter(x=>x.family===family).length!==2)errors.push("balanced sample identity count changed");

if(errors.length){
  console.error("L2 ten-item comparison policy validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: L2 ten-item comparison identity cap");
console.log(`Pool=62, identity=13, other=49, cap=${cap}`);
