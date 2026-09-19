import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const prospect = readJson("data/wave2-travel-maha-outer-frame-prospect-v106.json");
const survey = readJson("data/wave2-repeated-seam-survey-v107.json");
const sourceReview = readJson("data/yamauchi-visible-transcription-review-v112.json");
const deepReview = readJson("data/wave2-travel-deep-syntax-review-v113.json");
const schema = readJson("data/historical-research-candidate-schema-v61.json");
const currentFixture = readJson("data/generated-wave2-travel-outer-frame-v114.json");

function assemble({A,B,C,D,E}) {
  const reading = A+B+C+D+E+reverse(D)+reverse(C)+reverse(B)+reverse(A);
  return {
    reading,
    meter:[A,B+C,D+E,reverse(D)+reverse(C),reverse(B)+reverse(A)],
  };
}

const sourceById = new Map((prospect.sources ?? []).map(x => [x.id, x]));
const fixtureById = new Map((currentFixture.candidates ?? []).map(x => [x.id, x]));
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
  version:"1.14",
  historical_fixture_version:"1.08",
  source_review_version:sourceReview.version,
  deep_review_version:deepReview.version,
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
  if(sourceReview.version!=="1.12") errors.push(`source review version ${sourceReview.version}, expected 1.12`);
  if(deepReview.version!=="1.13") errors.push(`deep review version ${deepReview.version}, expected 1.13`);
  if(schema.version!=="0.61") errors.push(`schema version ${schema.version}, expected 0.61`);
  if(generated.length!==4) errors.push(`candidate count ${generated.length}, expected 4`);
  if(prospect.operation?.shared_B!=="まは") errors.push("shared B must remain まは");
  if(prospect.shared_B_review?.reverse_B_lexeme!=="unresolved") errors.push("historical prospect reverse B lexeme must remain unresolved");
  if(sourceReview.travel_family_effect?.sources_90_93_poem_specific_scholarly_transcription_confirmed!==true) errors.push("v1.12 poem-specific transcription evidence missing");
  if(sourceReview.source_layers?.readable_article_mirror?.direct_original_edo_source_image_inspection!==false) errors.push("v1.12 must not claim original source image inspection");
  if(deepReview.family_verdict?.status!=="third-positive-family-candidate-not-yet-established") errors.push("v1.13 family verdict drift");

  const expectedIds=["shoju-next-090","shoju-next-093","wave2-travel-090-host-093-outer","wave2-travel-093-host-090-outer"].sort().join(",");
  const ids=generated.map(x=>x.id).sort().join(",");
  if(ids!==expectedIds) errors.push(`ids mismatch: ${ids}`);

  for(const c of generated){
    for(const field of schema.candidate_required_fields??[]) if(!(field in c)) errors.push(`missing field ${field}: ${c.id}`);
    if(!c.strict_palindrome) errors.push(`non-palindrome: ${c.id}`);
    if(c.meter.map(x=>[...x].length).join(",")!=="5,7,5,7,7") errors.push(`meter mismatch: ${c.id}`);
    if(c.source_confidence_trace?.source_image_checked!==false) errors.push(`source-image claim drift: ${c.id}`);
    if(c.source_confidence_trace?.article_pdf_directly_inspected!==false) errors.push(`article-PDF claim drift: ${c.id}`);
    if(["accepted","natural","deep-review-supported"].includes(c.review_status)) errors.push(`premature positive status: ${c.id} / ${c.review_status}`);
  }

  const best=generated.find(x=>x.id==="wave2-travel-090-host-093-outer");
  const reverseCandidate=generated.find(x=>x.id==="wave2-travel-093-host-090-outer");
  if(best?.review_status!=="promising-but-parse-needed") errors.push("best travel candidate status must be promising-but-parse-needed");
  if(best?.semantic_role_trace?.status!=="compatible-tentative") errors.push("best travel candidate semantic role must remain compatible-tentative");
  if(reverseCandidate?.review_status!=="deep-review-needed") errors.push("reverse travel candidate status must remain deep-review-needed");
  if(reverseCandidate?.semantic_role_trace?.blocking_span!=="はまもくかもと") errors.push("reverse travel blocker drift");

  const reviewBest=(deepReview.candidate_reviews??[]).find(x=>x.id===best?.id);
  const reviewReverse=(deepReview.candidate_reviews??[]).find(x=>x.id===reverseCandidate?.id);
  if(reviewBest?.current_status!==best?.review_status) errors.push("v1.13/v1.14 best status mismatch");
  if(reviewReverse?.current_status!==reverseCandidate?.review_status) errors.push("v1.13/v1.14 reverse status mismatch");

  const frozenById=new Map((currentFixture.candidates??[]).map(x=>[x.id,x]));
  for(const c of generated){
    const frozen=frozenById.get(c.id);
    if(!frozen){ errors.push(`missing frozen candidate: ${c.id}`); continue; }
    if(frozen.reading!==c.reading) errors.push(`frozen reading drift: ${c.id}`);
    if(frozen.review_status!==c.review_status) errors.push(`frozen status drift: ${c.id}`);
    if(JSON.stringify(frozen.semantic_role_trace)!==JSON.stringify(c.semantic_role_trace)) errors.push(`frozen semantic-role drift: ${c.id}`);
    if(JSON.stringify(frozen.source_confidence_trace)!==JSON.stringify(c.source_confidence_trace)) errors.push(`frozen source-confidence drift: ${c.id}`);
  }

  if(errors.length){
    console.error("Wave2 travel outer-frame generator check failed:\n"+errors.map(x=>"- "+x).join("\n"));
    process.exit(1);
  }
  console.log("OK: reviewed wave2 travel outer-frame research generator v1.14");
  console.log(`Candidates: ${generated.length}; best=${best?.review_status}; reverse=${reverseCandidate?.review_status}`);
}

if(process.argv.includes("--check")) check();
else process.stdout.write(JSON.stringify(output,null,2)+"\n");
