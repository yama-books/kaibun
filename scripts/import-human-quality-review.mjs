import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const blind=readJson("data/public-quality-human-review-blind-v96.json");
const ledger=readJson("data/public-quality-human-adjudication-v97.json");
const schema=readJson("data/public-quality-human-review-response-schema-v128.json");

const args=process.argv.slice(2);
const argValue=name=>{
  const i=args.indexOf(name);
  return i>=0?args[i+1]:null;
};

const errors=[];
const forbidden=new Set(schema.response_container?.forbidden??[]);
const required=schema.response_required_fields??[];
const allowed=schema.allowed_values??{};

if(blind.version!=="0.96")errors.push(`blind version ${blind.version}, expected 0.96`);
if(ledger.version!=="0.97")errors.push(`ledger version ${ledger.version}, expected 0.97`);
if(schema.version!=="0.128")errors.push(`schema version ${schema.version}, expected 0.128`);
if((blind.candidates??[]).length!==50||(ledger.candidates??[]).length!==50)errors.push("blind/ledger candidate count must remain 50");

const blindById=new Map((blind.candidates??[]).map(x=>[x.review_id,x]));
const ledgerById=new Map((ledger.candidates??[]).map(x=>[x.review_id,x]));

for(const [id,b] of blindById){
  const l=ledgerById.get(id);
  if(!l)errors.push(`ledger missing ${id}`);
  else if(b.display!==l.display||b.canonical_reading!==l.canonical_reading)errors.push(`blind/ledger text drift ${id}`);
}

function validatePayload(payload){
  const local=[];
  for(const k of schema.response_container?.required??[]) if(!(k in payload)) local.push(`payload missing ${k}`);
  for(const k of Object.keys(payload)) if(forbidden.has(k)) local.push(`payload forbidden key ${k}`);
  if(payload.version!==schema.version)local.push(`payload version ${payload.version}, expected ${schema.version}`);
  if(payload.review_form_version!==blind.version)local.push(`review_form_version ${payload.review_form_version}, expected ${blind.version}`);
  if(typeof payload.reviewer_id!=="string"||!payload.reviewer_id.trim())local.push("reviewer_id must be non-empty string");
  if(!Array.isArray(payload.responses))local.push("responses must be array");
  if((payload.responses??[]).length!==50)local.push(`responses count ${payload.responses?.length??0}, expected 50`);

  const seen=new Set();
  for(const r of payload.responses??[]){
    if(!r||typeof r!=="object"){local.push("response must be object");continue;}
    for(const k of Object.keys(r))if(forbidden.has(k))local.push(`response forbidden key ${r.review_id??"?"}: ${k}`);
    for(const k of required)if(!(k in r))local.push(`response missing ${k}: ${r.review_id??"?"}`);
    if(!blindById.has(r.review_id))local.push(`unknown review_id ${r.review_id}`);
    if(seen.has(r.review_id))local.push(`duplicate review_id ${r.review_id}`);
    seen.add(r.review_id);
    for(const [field,values] of Object.entries(allowed)){
      if(!values.includes(r[field]))local.push(`invalid ${field} for ${r.review_id}: ${r[field]}`);
    }
    if(!Array.isArray(r.notes)||r.notes.some(x=>typeof x!=="string"))local.push(`notes must be string array: ${r.review_id}`);
    const allowedKeys=new Set(required);
    for(const k of Object.keys(r))if(!allowedKeys.has(k))local.push(`unexpected response key ${r.review_id}: ${k}`);
  }
  for(const id of blindById.keys())if(!seen.has(id))local.push(`missing review_id ${id}`);
  return local;
}

function buildImportPreview(payload){
  const responseById=new Map(payload.responses.map(x=>[x.review_id,x]));
  return {
    version:"0.128-import-preview",
    title:"Public quality post-blind import preview",
    source_ledger_version:ledger.version,
    source_blind_review_version:blind.version,
    human_response_version:payload.version,
    reviewer_id:payload.reviewer_id,
    status:"human-review-imported-awaiting-adjudication",
    allowed_actions:[...(ledger.allowed_actions??[])],
    candidates:(ledger.candidates??[]).map(x=>{
      const r=responseById.get(x.review_id);
      return {
        ...x,
        imported_human_review:{
          reviewer_id:payload.reviewer_id,
          grammar:r.grammar,
          semantic_coherence:r.semantic_coherence,
          display_reading_fidelity:r.display_reading_fidelity,
          productive_value:r.productive_value,
          overall_naturalness:r.overall_naturalness,
          confidence:r.confidence,
          notes:[...r.notes]
        },
        adjudication:{...x.adjudication,status:"pending",action:null}
      };
    })
  };
}

if(args.includes("--check")){
  if(errors.length){
    console.error("Human review importer baseline check failed:\n"+errors.map(x=>"- "+x).join("\n"));
    process.exit(1);
  }
  console.log("OK: human review importer v0.128 baseline");
  console.log("Blind=50, ledger=50; no human response file required for --check.");
  process.exit(0);
}

const input=argValue("--input");
if(!input){
  console.error("Usage: node scripts/import-human-quality-review.mjs --input <responses.json> [--output <preview.json>]");
  process.exit(2);
}
let payload;
try{payload=readJson(input)}catch(e){errors.push(`cannot read input ${input}: ${e.message}`);}
if(payload)errors.push(...validatePayload(payload));

if(errors.length){
  console.error("Human review import failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}

const preview=buildImportPreview(payload);
const output=argValue("--output");
const json=JSON.stringify(preview,null,2)+"\n";
if(output){
  fs.writeFileSync(output,json);
  console.log(`OK: wrote human-review import preview to ${output}`);
}else{
  process.stdout.write(json);
}
