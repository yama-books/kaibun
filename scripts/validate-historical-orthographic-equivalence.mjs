import fs from "node:fs";

const triage=JSON.parse(fs.readFileSync("data/historical-wave2-source-triage-v43.json","utf8"));
const wave3Expansion=JSON.parse(fs.readFileSync("data/historical-mining-wave3-expansion-v120.json","utf8"));
const wave3Diagnostics=JSON.parse(fs.readFileSync("data/historical-mining-wave3-diagnostics-v125.json","utf8"));
const oWoModel=JSON.parse(fs.readFileSync("data/historical-orthographic-equivalence-v126.json","utf8"));
const kanaCasebook=JSON.parse(fs.readFileSync("data/historical-kana-equivalence-casebook-v127.json","utf8"));

const reverse=s=>[...s].reverse().join("");
const isPalindrome=s=>s===reverse(s);
const canon=(s,pairs)=>{
  const map=new Map();
  for(const [a,b,label] of pairs){map.set(a,label);map.set(b,label);}
  return [...s].map(ch=>map.get(ch)??ch).join("");
};
const mismatchPositions=s=>{
  const a=[...s],r=[...reverse(s)],out=[];
  for(let i=0;i<a.length;i++)if(a[i]!==r[i])out.push(i+1);
  return out;
};

const errors=[];
if(oWoModel.version!=="1.26")errors.push(`o/wo version mismatch: ${oWoModel.version}`);
if(oWoModel.mode!=="research-diagnostic-only"||oWoModel.strict_baseline?.changed!==false)errors.push("o/wo model must remain diagnostic-only");
if(oWoModel.strict_baseline?.fixed50_unchanged!==true||oWoModel.strict_baseline?.wave2_verified_snapshot!==14||oWoModel.strict_baseline?.wave2_held_snapshot!==5)errors.push("o/wo baseline snapshot drift");
if(oWoModel.policy?.strict_promotions!==0||oWoModel.policy?.public_generator_effect!=="none")errors.push("o/wo model must not promote or affect public generator");

const triageByNo=new Map((triage.cases??[]).map(x=>[x.source_number,x]));
const wave3ByNo=new Map([...(wave3Expansion.cases??[]),...(wave3Diagnostics.cases??[])].map(x=>[x.source_number,x]));
const positiveNos=(oWoModel.positive_controls??[]).map(x=>x.source_number).sort((a,b)=>a-b);
if(positiveNos.join(",")!=="94,110,115,118")errors.push(`o/wo positive set drift: ${positiveNos.join(",")}`);

for(const p of oWoModel.positive_controls??[]){
  let sourceReading;
  if(p.source_number===94) sourceReading=triageByNo.get(94)?.candidate_reading;
  else sourceReading=wave3ByNo.get(p.source_number)?.conservative_reading;
  if(sourceReading!==p.reading)errors.push(`o/wo reading drift: ${p.source_number}`);
  if(isPalindrome(p.reading))errors.push(`o/wo control became strict: ${p.source_number}`);
  if(!isPalindrome(canon(p.reading,[["お","を","O"]])))errors.push(`o/wo control does not pass diagnostic: ${p.source_number}`);
  const pos=mismatchPositions(p.reading);
  if(JSON.stringify(pos)!==JSON.stringify(p.mismatch_positions))errors.push(`o/wo mismatch positions drift: ${p.source_number} / ${pos}`);
}

for(const n of [82,88,92]){
  const reading=triageByNo.get(n)?.candidate_reading;
  if(reading&&isPalindrome(canon(reading,[["お","を","O"]])))errors.push(`o/wo negative unexpectedly passes: ${n}`);
}
const p106=wave3ByNo.get(106)?.conservative_reading;
if(p106&&isPalindrome(canon(p106,[["お","を","O"]])))errors.push("poem106 must remain negative after o/wo fold");

if(kanaCasebook.version!=="1.27")errors.push(`kana casebook version mismatch: ${kanaCasebook.version}`);
if(kanaCasebook.mode!=="research-diagnostic-only"||kanaCasebook.strict_baseline_changed!==false)errors.push("kana casebook must remain diagnostic-only");
if(kanaCasebook.verdict?.strict_promotions!==0||kanaCasebook.verdict?.public_generator_effect!=="none")errors.push("kana casebook must not promote or affect public generator");

const he=(kanaCasebook.profiles??[]).find(x=>x.id==="he-e-diagnostic")?.cases?.[0];
if(!he||he.source_number!==107)errors.push("he/e case 107 missing");
if(he){
  if(isPalindrome(he.reading))errors.push("107 must remain non-strict");
  if(!isPalindrome(canon(he.reading,[["へ","え","E"]])))errors.push("107 he/e diagnostic must pass");
  if(JSON.stringify(mismatchPositions(he.reading))!==JSON.stringify(he.literal_mismatch_positions))errors.push("107 mismatch positions drift");
}
const ye=(kanaCasebook.profiles??[]).find(x=>x.id==="ye-e-diagnostic")?.cases?.[0];
if(!ye||ye.source_number!==117)errors.push("ye/e case 117 missing");
if(ye){
  if(isPalindrome(ye.historical_kana_reading))errors.push("117 must remain non-strict");
  if(!isPalindrome(canon(ye.historical_kana_reading,[["ゑ","え","E"]])))errors.push("117 ye/e diagnostic must pass");
}

if(errors.length){
  console.error("Historical orthographic/kana diagnostic validation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log("OK: historical diagnostics v1.26-v1.27");
console.log("Strict baseline unchanged; o/wo positives=94,110,115,118; he/e=107; ye/e=117");
