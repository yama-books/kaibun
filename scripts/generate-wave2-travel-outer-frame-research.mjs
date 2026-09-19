import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const prospect = readJson("data/wave2-travel-maha-outer-frame-prospect-v106.json");
const survey = readJson("data/wave2-repeated-seam-survey-v107.json");
const schema = readJson("data/historical-research-candidate-schema-v61.json");
const frozenFixture = readJson("data/generated-wave2-travel-outer-frame-v108.json");

function assemble({A,B,C,D,E}) {
  const reading = A+B+C+D+E+reverse(D)+reverse(C)+reverse(B)+reverse(A);
  return {
    reading,
    meter:[A,B+C,D+E,reverse(D)+reverse(C),reverse(B)+reverse(A)],
  };
}

const sourceById = new Map((prospect.sources ?? []).map(x => [x.id, x]));
const fixtureById = new Map((frozenFixture.candidates ?? []).map(x => [x.id, x]));
const generated=[];

for(const source of prospect.sources ?? []) {
  const built=assemble(source.factors);
  const fixture=fixtureById.get(source.id);
  if(!fixture) throw new Error(`Missing historical fixture for ${source.id}`);
  generated.push({
    ...fixture,
    reading:built.reading,
    meter:built.meter,
    factors:{...source.factors},
    strict_palindrome:isPalindrome(built.reading),
  });
}

for(const p of prospect.generated_prospects ?? []) {
  const host=sourceById.get(p.host_source_id);
  const donor=sourceById.get(p.donor_source_id);
  if(!host||!donor) throw new Error(`Missing source for prospect ${p.id}`);
  const factors={
    A:donor.factors.A,
    B:host.factors.B,
    C:host.factors.C,
    D:host.factors.D,
    E:host.factors.E,
  };
  const built=assemble(factors);
  const fixture=fixtureById.get(p.id);
  if(!fixture) throw new Error(`Missing prospect fixture for ${p.id}`);
  generated.push({
    ...fixture,
    reading:built.reading,
    meter:built.meter,
    factors,
    strict_palindrome:isPalindrome(built.reading),
  });
}

generated.sort((a,b)=>a.id.localeCompare(b.id));

const output={
  version:"1.08",
  source_prospect_version:prospect.version,
  survey_version:survey.version,
  common_schema_version:schema.version,
  operation:"shared-B-outer-frame-swap",
  family:"wave2-travel-maha",
  candidate_count:generated.length,
  candidates:generated,
};

function check(){
  const errors=[];
  if(prospect.version!=="1.06") errors.push(`prospect version ${prospect.version}, expected 1.06`);
  if(survey.version!=="1.07") errors.push(`survey version ${survey.version}, expected 1.07`);
  if(schema.version!=="0.61") errors.push(`schema version ${schema.version}, expected 0.61`);
  if(generated.length!==4) errors.push(`candidate count ${generated.length}, expected 4`);
  if(prospect.operation?.shared_B!=="まは") errors.push("shared B must remain まは");
  if(prospect.shared_B_review?.reverse_B_lexeme!=="unresolved") errors.push("reverse B lexeme must remain unresolved");
  if(prospect.shared_B_review?.source_image_checked!==false) errors.push("source image must remain unchecked");
  if(survey.summary?.new_same_title_family_with_novel_exchange?.[0]!=="B=まは / travel 90-93") errors.push("v1.07 survey priority drift");

  const expectedIds=["shoju-next-090","shoju-next-093","wave2-travel-090-host-093-outer","wave2-travel-093-host-090-outer"].sort().join(",");
  const ids=generated.map(x=>x.id).sort().join(",");
  if(ids!==expectedIds) errors.push(`ids mismatch: ${ids}`);

  for(const c of generated){
    for(const field of schema.candidate_required_fields??[]) if(!(field in c)) errors.push(`missing field ${field}: ${c.id}`);
    if(!c.strict_palindrome) errors.push(`non-palindrome: ${c.id}`);
    if(c.meter.map(x=>[...x].length).join(",")!=="5,7,5,7,7") errors.push(`meter mismatch: ${c.id}`);
    if(c.morphology_trace?.reverse_B_lexeme!=="unresolved") errors.push(`reverse B lexical drift: ${c.id}`);
    if(c.source_confidence_trace?.source_image_checked!==false) errors.push(`source image claim drift: ${c.id}`);
    if(["accepted","natural","deep-review-supported"].includes(c.review_status)) errors.push(`premature positive status: ${c.id} / ${c.review_status}`);
  }

  const novel=generated.filter(x=>x.id.startsWith("wave2-travel-"));
  if(novel.length!==2) errors.push("novel prospect count must be 2");
  for(const c of novel){
    if(c.review_status!=="hold-source-confirmation") errors.push(`novel status drift: ${c.id}`);
    if(c.scene_trace?.status!=="pass-title-level-same-travel") errors.push(`scene trace drift: ${c.id}`);
    if(c.semantic_role_trace?.status!=="review-needed") errors.push(`semantic-role drift: ${c.id}`);
  }

  const frozenById=new Map((frozenFixture.candidates??[]).map(x=>[x.id,x]));
  for(const c of generated){
    const frozen=frozenById.get(c.id);
    if(!frozen){ errors.push(`missing frozen candidate: ${c.id}`); continue; }
    if(frozen.reading!==c.reading) errors.push(`frozen reading drift: ${c.id}`);
    if(frozen.review_status!==c.review_status) errors.push(`frozen status drift: ${c.id}`);
    if(JSON.stringify(frozen.morphology_trace)!==JSON.stringify(c.morphology_trace)) errors.push(`frozen morphology drift: ${c.id}`);
    if(JSON.stringify(frozen.scene_trace)!==JSON.stringify(c.scene_trace)) errors.push(`frozen scene drift: ${c.id}`);
  }

  if(errors.length){
    console.error("Wave2 travel outer-frame generator check failed:\n"+errors.map(x=>"- "+x).join("\n"));
    process.exit(1);
  }
  console.log("OK: wave2 travel outer-frame research generator");
  console.log(`Candidates: ${generated.length}; held novel=${novel.length}`);
}

if(process.argv.includes("--check")) check();
else process.stdout.write(JSON.stringify(output,null,2)+"\n");
