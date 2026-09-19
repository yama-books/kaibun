import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const benchmark=readJson("data/public-quality-benchmark-v79.json");
const blind=readJson("data/public-quality-human-review-blind-v96.json");
const ledger=readJson("data/public-quality-human-adjudication-v97.json");

const errors=[];
if(benchmark.version!=="0.79")errors.push(`benchmark version ${benchmark.version}, expected 0.79`);
if(blind.version!=="0.96")errors.push(`blind review version ${blind.version}, expected 0.96`);
if(ledger.version!=="0.97")errors.push(`ledger version ${ledger.version}, expected 0.97`);
if((blind.candidates??[]).length!==50)errors.push("blind review candidate count must be 50");
if((ledger.candidates??[]).length!==50)errors.push("adjudication ledger candidate count must be 50");

const benchmarkById=new Map((benchmark.candidates??[]).map(x=>[x.benchmark_id,x]));
const forbiddenBlindKeys=new Set(["source_pool","source_id","layer","current_japanese_quality","japanese_quality","weirdness","model_review","layer_fit"]);

for(const c of blind.candidates??[]){
  const src=benchmarkById.get(c.review_id);
  if(!src){errors.push(`unknown blind review id ${c.review_id}`);continue}
  if(c.display!==src.display)errors.push(`blind display drift ${c.review_id}`);
  if(c.canonical_reading!==src.reading)errors.push(`blind reading drift ${c.review_id}`);
  for(const key of Object.keys(c))if(forbiddenBlindKeys.has(key))errors.push(`blind leakage ${c.review_id}: ${key}`);
  const r=c.human_review??{};
  for(const key of ["reviewer_id","grammar","semantic_coherence","display_reading_fidelity","productive_value","overall_naturalness","confidence"]){
    if(r[key]!==null)errors.push(`blind template must remain unreviewed ${c.review_id}: ${key}`);
  }
  if(!Array.isArray(r.notes)||r.notes.length!==0)errors.push(`blind notes must start empty ${c.review_id}`);
}

const ledgerById=new Map((ledger.candidates??[]).map(x=>[x.review_id,x]));
for(const src of benchmark.candidates??[]){
  const x=ledgerById.get(src.benchmark_id);
  if(!x){errors.push(`missing ledger id ${src.benchmark_id}`);continue}
  if(x.display!==src.display||x.canonical_reading!==src.reading)errors.push(`ledger text drift ${src.benchmark_id}`);
  const m=x.current_product_metadata??{};
  if(m.source_pool!==src.source_pool||m.source_id!==src.source_id||m.layer!==src.layer||m.japanese_quality!==src.current_japanese_quality||m.weirdness!==src.weirdness){
    errors.push(`ledger metadata drift ${src.benchmark_id}`);
  }
  if(x.imported_human_review!==null)errors.push(`ledger must await human review ${src.benchmark_id}`);
  if(x.adjudication?.status!=="pending"||x.adjudication?.action!==null)errors.push(`ledger adjudication must start pending ${src.benchmark_id}`);
}

const allowed=new Set(ledger.allowed_actions??[]);
for(const action of ["keep-current","promote-layer","demote-layer","hold","display-fix","reading-hint","metadata-only"]){
  if(!allowed.has(action))errors.push(`missing allowed adjudication action ${action}`);
}

if(errors.length){
  console.error("Human quality review protocol validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: human quality review protocol v96-v97");
console.log("Blind candidates=50; product metadata remains separate until adjudication.");
