import fs from "node:fs";

const triage=JSON.parse(fs.readFileSync("data/historical-wave2-source-triage-v43.json","utf8"));
const model=JSON.parse(fs.readFileSync("data/historical-orthographic-equivalence-v116.json","utf8"));

const reverse=s=>[...s].reverse().join("");
const isPalindrome=s=>s===reverse(s);

function canonicalizeOWo(s){
  return [...s].map(ch=>ch==="お"||ch==="を"?"O":ch).join("");
}

const errors=[];
if(model.version!=="1.16")errors.push(`version mismatch: ${model.version}`);
if(model.mode!=="research-diagnostic-only")errors.push("mode must remain research-diagnostic-only");
if(model.strict_baseline?.changed!==false)errors.push("strict baseline must remain unchanged");
if(model.strict_baseline?.wave2_verified_snapshot!==14||model.strict_baseline?.wave2_held_snapshot!==5)errors.push("wave2 snapshot counts drift");

const triageByNo=new Map((triage.cases??[]).map(x=>[x.source_number,x]));
const expected=new Map((model.cases??[]).map(x=>[x.source_number,x]));

for(const n of [82,88,92,94]){
  const source=triageByNo.get(n);
  const fixture=expected.get(n);
  if(!source||!fixture){errors.push(`missing case ${n}`);continue;}
  if(source.candidate_reading!==fixture.reading)errors.push(`reading drift case ${n}`);
  const strict=isPalindrome(fixture.reading);
  const diagnostic=isPalindrome(canonicalizeOWo(fixture.reading));
  if(strict!==fixture.strict_palindrome)errors.push(`strict result drift case ${n}`);
  if(diagnostic!==fixture.o_wo_diagnostic_palindrome)errors.push(`o/wo diagnostic drift case ${n}`);
  if([...fixture.reading].length!==fixture.length)errors.push(`length drift case ${n}`);
}

const positives=(model.cases??[]).filter(x=>x.o_wo_diagnostic_palindrome&&!x.strict_palindrome).map(x=>x.source_number);
if(positives.join(",")!=="94")errors.push(`diagnostic positive set drift: ${positives.join(",")}`);
if(model.verdict?.strict_promotions!==0)errors.push("diagnostic layer must not promote strict records");
if(model.verdict?.public_generator_effect!=="none")errors.push("diagnostic layer must not affect public generator");

const p94=expected.get(94);
const mismatches=[];
const chars=[...p94.reading];
const rev=[...reverse(p94.reading)];
for(let i=0;i<chars.length;i++)if(chars[i]!==rev[i])mismatches.push({position_1_based:i+1,forward:chars[i],mirror:rev[i]});
if(JSON.stringify(mismatches)!==JSON.stringify(p94.literal_mismatches))errors.push("poem94 literal mismatch positions drift");

const p82=expected.get(82);
const c82=canonicalizeOWo(p82.reading);
let mm82=0;
for(let i=0;i<[...c82].length;i++)if([...c82][i]!==[...reverse(c82)][i])mm82++;
if(mm82!==p82.remaining_mismatch_count_after_o_wo)errors.push(`poem82 remaining mismatch drift: ${mm82}`);

if(errors.length){
  console.error("Historical orthographic-equivalence validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: historical orthographic-equivalence diagnostic v1.16");
console.log("Strict baseline unchanged; o/wo-only diagnostic positive: 94");
