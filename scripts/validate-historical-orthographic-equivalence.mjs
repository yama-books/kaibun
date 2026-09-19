import fs from "node:fs";

const triage=JSON.parse(fs.readFileSync("data/historical-wave2-source-triage-v43.json","utf8"));
const oldModel=JSON.parse(fs.readFileSync("data/historical-orthographic-equivalence-v116.json","utf8"));
const wave3=JSON.parse(fs.readFileSync("data/historical-mining-wave3-expansion-v120.json","utf8"));
const model=JSON.parse(fs.readFileSync("data/historical-orthographic-equivalence-v121.json","utf8"));
const kanaModel=JSON.parse(fs.readFileSync("data/historical-kana-equivalence-v122.json","utf8"));

const reverse=s=>[...s].reverse().join("");
const isPalindrome=s=>s===reverse(s);

function canonicalizeOWo(s){
  return [...s].map(ch=>ch==="お"||ch==="を"?"O":ch).join("");
}
function canonicalizeYeE(s){
  return [...s].map(ch=>ch==="ゑ"||ch==="え"?"E":ch).join("");
}
function mismatchPositions(s){
  const a=[...s], r=[...reverse(s)], out=[];
  for(let i=0;i<a.length;i++) if(a[i]!==r[i]) out.push(i+1);
  return out;
}

const errors=[];

if(oldModel.version!=="1.16")errors.push("historical v1.16 snapshot missing");
if(model.version!=="1.21")errors.push(`version mismatch: ${model.version}`);
if(model.mode!=="research-diagnostic-only")errors.push("mode must remain research-diagnostic-only");
if(model.strict_baseline?.changed!==false)errors.push("strict baseline must remain unchanged");
if(model.strict_baseline?.wave2_verified_snapshot!==14||model.strict_baseline?.wave2_held_snapshot!==5)errors.push("wave2 snapshot counts drift");
if(model.policy?.strict_promotions!==0||model.policy?.public_generator_effect!=="none")errors.push("o/wo diagnostic must not promote or affect public generator");

const wave3ByNo=new Map((wave3.cases??[]).map(x=>[x.source_number,x]));
const positiveExpected=new Map((model.positive_controls??[]).map(x=>[x.source_number,x]));
const expectedReadings=new Map();

for(const n of [82,88,92,94]){
  const old=(oldModel.cases??[]).find(x=>x.source_number===n);
  if(old) expectedReadings.set(n,old.reading);
}
for(const n of [115,118]){
  const x=wave3ByNo.get(n);
  if(x?.conservative_reading) expectedReadings.set(n,x.conservative_reading);
}

for(const n of [94,115,118]){
  const fixture=positiveExpected.get(n);
  const reading=expectedReadings.get(n);
  if(!fixture||!reading){errors.push(`missing positive control ${n}`);continue;}
  if(fixture.reading!==reading)errors.push(`reading drift positive ${n}`);
  if(isPalindrome(reading)!==false)errors.push(`strict status drift positive ${n}`);
  if(!isPalindrome(canonicalizeOWo(reading)))errors.push(`o/wo diagnostic must pass ${n}`);
  const pos=mismatchPositions(reading);
  if(JSON.stringify(pos)!==JSON.stringify(fixture.literal_mismatch_positions))errors.push(`mismatch positions drift positive ${n}: ${pos}`);
}

for(const n of [82,88,92]){
  const reading=expectedReadings.get(n);
  if(!reading){errors.push(`missing negative reading ${n}`);continue;}
  if(isPalindrome(canonicalizeOWo(reading)))errors.push(`negative control unexpectedly passes: ${n}`);
}
const positives=(model.positive_controls??[]).map(x=>x.source_number).sort((a,b)=>a-b).join(",");
if(positives!=="94,115,118")errors.push(`o/wo positive set drift: ${positives}`);

if(kanaModel.version!=="1.22")errors.push(`historical-kana version mismatch: ${kanaModel.version}`);
if(kanaModel.mode!=="research-diagnostic-only")errors.push("historical-kana mode must remain diagnostic-only");
const h=kanaModel.readings?.historical_kana_preserving;
const e=kanaModel.readings?.modernized_e_fold;
if(!h||[...h].length!==31)errors.push("historical-kana reading must remain 31 kana");
if(h&&isPalindrome(h)!==false)errors.push("historical-kana reading must remain non-strict");
if(h&&!isPalindrome(canonicalizeYeE(h)))errors.push("declared ye/e diagnostic must pass");
if(e&&!isPalindrome(e))errors.push("modernized e-fold reference must remain palindrome");
if(kanaModel.results?.strict_promotion!==false||kanaModel.verdict?.strict_baseline_changed!==false||kanaModel.verdict?.public_generator_effect!=="none")errors.push("historical-kana diagnostic must not promote or alter baseline");

if(errors.length){
  console.error("Historical orthographic-equivalence validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: historical orthographic diagnostics v1.21-v1.22");
console.log("Strict baseline unchanged; o/wo positives=94,115,118; ye/e diagnostic=117");
