import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const seeds=readJson("data/layered-seeds-v08.json");
const rules=readJson("data/generation-rules-v08.json");
const pairs=readJson("data/reverse-lexeme-pairs-v09.json");
const seams=readJson("data/seam-grammar-v25.json");
const bridge=readJson("data/modern-bridge-public-v69.json");
const frozen=readJson("data/public-quality-benchmark-v79.json");

const rev=s=>[...s].reverse().join("");
const isPal=s=>s===rev(s);
const defaultWeird={L1:2,L2:3,L3:4};

function stableHash(text){
  let h=2166136261>>>0;
  for(const c of String(text??"")){
    h^=c.codePointAt(0);
    h=Math.imul(h,16777619)>>>0;
  }
  return h>>>0;
}
function variantLayer(rule,v){
  if(v&&["L1","L2","L3"].includes(v[2]))return v[2];
  if((rule.layer||"").includes("/"))return null;
  return rule.layer;
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

const records=[];
for(const x of seeds.records??[])records.push({...x,source_pool:"seed",source_id:x.id});

for(const rule of rules.rules??[]){
  if(rule.type==="recursive_kinship"){
    for(const np of recursiveNPs(rule,1)){
      const weirdness=rule.weirdness_by_depth?.[np.depth]??(1+np.depth);
      for(const fr of rule.frames)records.push({
        display:fr.display.replace("{np}",np.display),reading:fr.left+np.reading+fr.right,
        layer:rule.layer,japanese_quality:rule.layer==="L1"?"A":rule.layer==="L2"?"A-":"C",
        weirdness,source_pool:"dna",source_id:rule.id
      });
    }
    continue;
  }
  if(rule.type==="fixed"){
    const l=rule.layer;
    records.push({display:rule.display,reading:rule.reading,layer:l,japanese_quality:l==="L1"?"A":l==="L2"?"A-":"C",weirdness:rule.weirdness??defaultWeird[l],source_pool:"dna",source_id:rule.id});
    continue;
  }
  if(rule.type==="particle_pair"){
    for(const v of rule.variants??[]){
      const l=rule.layer;
      records.push({display:v[1],reading:rule.left+v[0]+rule.right,layer:l,japanese_quality:l==="L1"?"A":l==="L2"?"A-":"C",weirdness:rule.weirdness??defaultWeird[l],source_pool:"dna",source_id:rule.id});
    }
    continue;
  }
  if(rule.type==="mirrored_coordination"){
    for(const v of rule.variants??[]){
      const l=rule.layer;
      records.push({display:v[1],reading:rule.reading_pattern.replace("{person}",v[0]),layer:l,japanese_quality:l==="L1"?"A":l==="L2"?"A-":"C",weirdness:rule.weirdness??defaultWeird[l],source_pool:"dna",source_id:rule.id});
    }
    continue;
  }
  for(const v of rule.variants??[]){
    const l=variantLayer(rule,v)||(rule.layer||"").split("/")[0];
    let reading=rule.reading_pattern||"";
    if(reading.includes("{c}"))reading=reading.replace("{c}",v[0]);
    if(reading.includes("{pal_center}"))reading=reading.replace("{pal_center}",v[0]);
    records.push({display:v[1],reading,layer:l,japanese_quality:l==="L1"?"A":l==="L2"?"A-":"C",weirdness:rule.weirdness??defaultWeird[l],source_pool:"dna",source_id:rule.id});
  }
}

for(const p of pairs.pairs??[]){
  if(p.right.reading!==rev(p.left.reading))continue;
  for(const v of p.variants??[])records.push({
    display:p.left.display+v.particle+(v.right_display||p.right.display)+"。",
    reading:p.left.reading+v.particle+p.right.reading,
    layer:v.layer,japanese_quality:v.layer==="L1"?"A":"A-",weirdness:v.weirdness,
    source_pool:"pair",source_id:p.id
  });
}
for(const r of seams.recipes??[])records.push({
  display:r.display,reading:r.reading,layer:r.layer,japanese_quality:r.japanese_quality||"A-",weirdness:r.weirdness??2,
  source_pool:"seam",source_id:r.id
});
for(const r of bridge.candidates??[])records.push({
  display:r.display,reading:r.reading,layer:r.layer,japanese_quality:r.japanese_quality,weirdness:r.weirdness,
  source_pool:"bridge",source_id:r.id
});

const quotas={
  L1:{seed:6,dna:8,pair:4,seam:4,bridge:3},
  L2:{seed:6,dna:4,pair:4,seam:4,bridge:3},
  L3:{seed:4}
};

const benchmark=[];
for(const [layer,sourceQuotas] of Object.entries(quotas)){
  for(const [source_pool,n] of Object.entries(sourceQuotas)){
    const pool=records
      .filter(x=>x.layer===layer&&x.source_pool===source_pool&&(x.weirdness??defaultWeird[layer])<=defaultWeird[layer]&&isPal(x.reading))
      .sort((a,b)=>{
        const ha=stableHash(source_pool+"|"+layer+"|"+a.reading),hb=stableHash(source_pool+"|"+layer+"|"+b.reading);
        return ha-hb||a.reading.localeCompare(b.reading);
      });
    const seen=new Set();
    const unique=pool.filter(x=>seen.has(x.reading)?false:(seen.add(x.reading),true));
    if(unique.length<n)throw new Error(`Insufficient ${layer}/${source_pool}: ${unique.length}<${n}`);
    for(const x of unique.slice(0,n))benchmark.push({
      benchmark_id:`QB-${String(benchmark.length+1).padStart(3,"0")}`,
      source_pool,source_id:x.source_id,layer,
      display:x.display,reading:x.reading,
      current_japanese_quality:x.japanese_quality,
      weirdness:x.weirdness??defaultWeird[layer],
      review:{grammar:null,semantic_coherence:null,weirdness_usefulness:null,display_reading_fidelity:null,overall:null,notes:[]}
    });
  }
}

const output={
  version:"0.79",
  baseline_version:"0.76",
  purpose:"Post-calibration deterministic source-stratified public quality benchmark.",
  sample_size:benchmark.length,
  quotas,
  selection:"Same stable-hash procedure as v0.76 after v0.78 seam calibration.",
  candidates:benchmark
};

function check(){
  const errors=[];
  if(output.sample_size!==50)errors.push(`sample size ${output.sample_size}, expected 50`);
  if(frozen.version!=="0.79")errors.push(`frozen benchmark version ${frozen.version}, expected 0.79`);
  if(frozen.sample_size!==output.sample_size)errors.push(`frozen sample size ${frozen.sample_size}, generated ${output.sample_size}`);
  const frozenById=new Map((frozen.candidates??[]).map(x=>[x.benchmark_id,x]));
  for(const c of benchmark){
    const prev=frozenById.get(c.benchmark_id);
    if(!prev){errors.push(`missing frozen benchmark item ${c.benchmark_id}`);continue}
    if(prev.reading!==c.reading)errors.push(`benchmark reading drift ${c.benchmark_id}`);
    if(prev.source_pool!==c.source_pool||prev.layer!==c.layer)errors.push(`benchmark stratum drift ${c.benchmark_id}`);
  }
  for(const c of benchmark){
    if(!isPal(c.reading))errors.push(`non-palindrome ${c.benchmark_id}`);
    if(c.review.overall!==null)errors.push(`benchmark seed must begin unreviewed: ${c.benchmark_id}`);
  }
  const counts={};
  for(const c of benchmark){
    const k=c.layer+"/"+c.source_pool;counts[k]=(counts[k]??0)+1;
  }
  for(const [layer,qs] of Object.entries(quotas))for(const [src,n] of Object.entries(qs)){
    if((counts[layer+"/"+src]??0)!==n)errors.push(`quota mismatch ${layer}/${src}`);
  }
  if(errors.length){
    console.error("Public quality benchmark build failed:\n"+errors.map(x=>"- "+x).join("\n"));
    process.exit(1);
  }
  console.log("OK: public quality benchmark seed");
  console.log(`Candidates: ${benchmark.length}`);
}

if(process.argv.includes("--check"))check();
else process.stdout.write(JSON.stringify(output,null,2)+"\n");
