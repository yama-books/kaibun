import fs from "node:fs";

const readJson=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const audit=readJson("data/public-reading-fidelity-audit-v81.json");
const hints=readJson("data/public-reading-hints-v82.json");
const seeds=readJson("data/layered-seeds-v08.json");
const rules=readJson("data/generation-rules-v08.json");
const pairs=readJson("data/reverse-lexeme-pairs-v09.json");
const seams=readJson("data/seam-grammar-v25.json");
const bridge=readJson("data/modern-bridge-public-v69.json");

const errors=[];
if(audit.version!=="0.81")errors.push(`audit version ${audit.version}, expected 0.81`);
if(hints.version!=="0.82")errors.push(`hint version ${hints.version}, expected 0.82`);

const high=(audit.audited_lexemes??[]).filter(x=>x.risk==="high");
const hintByDisplay=new Map((hints.lexemes??[]).map(x=>[x.display,x]));
for(const x of high){
  const h=hintByDisplay.get(x.display);
  if(!h)errors.push(`missing high-risk hint: ${x.display}`);
  else if(h.canonical_reading!==x.canonical_reading)errors.push(`reading mismatch: ${x.display}`);
}
for(const h of hints.lexemes??[]){
  if(!high.some(x=>x.display===h.display))errors.push(`hint without high-risk audit entry: ${h.display}`);
}

const occurrences=[];
for(const x of seeds.records??[])occurrences.push({source:"seed",id:x.id,display:x.display,reading:x.reading});

for(const rule of rules.rules??[]){
  if(rule.type==="fixed"){
    occurrences.push({source:"rule",id:rule.id,display:rule.display,reading:rule.reading});
    continue;
  }
  if(rule.type==="particle_pair"){
    for(const v of rule.variants??[])occurrences.push({source:"rule",id:rule.id,display:v[1],reading:rule.left+v[0]+rule.right});
    continue;
  }
  if(rule.type==="mirrored_coordination"){
    for(const v of rule.variants??[])occurrences.push({source:"rule",id:rule.id,display:v[1],reading:rule.reading_pattern.replace("{person}",v[0])});
    continue;
  }
  if(rule.type==="recursive_kinship")continue;
  for(const v of rule.variants??[]){
    let reading=rule.reading_pattern??"";
    if(reading.includes("{c}"))reading=reading.replace("{c}",v[0]);
    if(reading.includes("{pal_center}"))reading=reading.replace("{pal_center}",v[0]);
    occurrences.push({source:"rule",id:rule.id,display:v[1],reading});
  }
}

for(const p of pairs.pairs??[]){
  for(const v of p.variants??[]){
    occurrences.push({
      source:"pair",id:p.id,
      display:p.left.display+v.particle+(v.right_display||p.right.display)+"。",
      reading:p.left.reading+v.particle+p.right.reading
    });
  }
}
for(const r of seams.recipes??[])occurrences.push({source:"seam",id:r.id,display:r.display,reading:r.reading});
for(const r of bridge.candidates??[])occurrences.push({source:"bridge",id:r.id,display:r.display,reading:r.reading});

const coverage={};
const seenReadings=new Set();
for(const x of occurrences){
  for(const h of hints.lexemes??[]){
    if(!String(x.display??"").includes(h.display))continue;
    if(!String(x.reading??"").includes(h.canonical_reading)){
      errors.push(`display contains ${h.display} but canonical reading missing: ${x.source}:${x.id} / ${x.reading}`);
      continue;
    }
    const key=h.id+"|"+x.reading;
    if(seenReadings.has(key))continue;
    seenReadings.add(key);
    coverage[h.id]=(coverage[h.id]??0)+1;
  }
}

for(const h of hints.lexemes??[]){
  const expected=hints.expected_coverage?.[h.id];
  if(expected!=null&&(coverage[h.id]??0)!==expected){
    errors.push(`coverage mismatch ${h.id}: ${coverage[h.id]??0}, expected ${expected}`);
  }
}
const total=Object.values(coverage).reduce((a,b)=>a+b,0);
if(total!==hints.expected_coverage?.unique_public_candidates){
  errors.push(`total coverage ${total}, expected ${hints.expected_coverage?.unique_public_candidates}`);
}

if(errors.length){
  console.error("Public reading hint validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log(`OK: public reading hints cover ${total} unique high-risk candidates (${JSON.stringify(coverage)})`);
