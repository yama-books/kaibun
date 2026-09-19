import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const family = readJson("data/musu-moon-family-review-v103.json");
const schema = readJson("data/historical-research-candidate-schema-v61.json");
const frozenFixture = readJson("data/generated-musu-moon-outer-frame-v104.json");

function assemble({A,B,C,D,E}) {
  const reading = A+B+C+D+E+reverse(D)+reverse(C)+reverse(B)+reverse(A);
  return {
    reading,
    meter:[A,B+C,D+E,reverse(D)+reverse(C),reverse(B)+reverse(A)],
  };
}

const host = family.host_context;
const generated = (family.outputs ?? []).map(fixture => {
  const factors = {
    A: fixture.factors.A,
    B: host.factors.B,
    C: host.factors.C,
    D: host.factors.D,
    E: host.factors.E,
  };
  const built = assemble(factors);
  return {
    ...fixture,
    reading: built.reading,
    meter: built.meter,
    factors,
    strict_palindrome: isPalindrome(built.reading),
  };
}).sort((a,b)=>a.id.localeCompare(b.id));

const output = {
  version:"1.04",
  source_family_version:family.version,
  common_schema_version:schema.version,
  operation:"shared-B-outer-frame-swap",
  family:family.family_id,
  candidate_count:generated.length,
  candidates:generated,
};

function check() {
  const errors=[];
  if(family.version!=="1.03") errors.push(`family version ${family.version}, expected 1.03`);
  if(schema.version!=="0.61") errors.push(`schema version ${schema.version}, expected 0.61`);
  if(generated.length!==4) errors.push(`candidate count ${generated.length}, expected 4`);
  if(family.operation?.source_specific_corridor?.D!=="むす") errors.push("D corridor must remain むす");
  if(family.operation?.source_specific_corridor?.global_transferability!==false) errors.push("D=むす must not become globally transferable");

  for(const c of generated) {
    for(const field of schema.candidate_required_fields ?? []) {
      if(!(field in c)) errors.push(`missing field ${field}: ${c.id}`);
    }
    if(!c.strict_palindrome) errors.push(`non-palindrome: ${c.id}`);
    if(c.meter.map(x=>[...x].length).join(",")!=="5,7,5,7,7") errors.push(`meter mismatch: ${c.id}`);
    if(c.factors.B!==host.factors.B || c.factors.C!==host.factors.C || c.factors.D!==host.factors.D || c.factors.E!==host.factors.E) {
      errors.push(`host corridor drift: ${c.id}`);
    }
    if(c.morphology_trace?.D_global_transfer===true) errors.push(`illegal global D promotion: ${c.id}`);
    if(["accepted","natural"].includes(c.review_status)) errors.push(`machine-final status forbidden: ${c.id}`);
  }

  const expectedIds=["shoju-add-109","hybrid-003","hybrid-007","hybrid-014"].sort().join(",");
  const ids=generated.map(x=>x.id).sort().join(",");
  if(ids!==expectedIds) errors.push(`IDs mismatch generated=${ids} expected=${expectedIds}`);

  const h7=generated.find(x=>x.id==="hybrid-007");
  const h3=generated.find(x=>x.id==="hybrid-003");
  const h14=generated.find(x=>x.id==="hybrid-014");
  if(h7?.review_status!=="promising-but-parse-needed") errors.push("hybrid-007 must remain promising-but-parse-needed");
  if(h3?.review_status!=="hold-scene-mismatch") errors.push("hybrid-003 scene-control status changed");
  if(h14?.review_status!=="hold-source-confirmation") errors.push("hybrid-014 source-hold status changed");

  if(frozenFixture.version!=="1.04") errors.push(`fixture version ${frozenFixture.version}, expected 1.04`);
  if(frozenFixture.candidate_count!==generated.length) errors.push("fixture candidate count mismatch");
  const frozenById=new Map((frozenFixture.candidates??[]).map(x=>[x.id,x]));
  for(const c of generated) {
    const frozen=frozenById.get(c.id);
    if(!frozen) { errors.push(`missing frozen candidate: ${c.id}`); continue; }
    if(frozen.reading!==c.reading) errors.push(`frozen reading drift: ${c.id}`);
    if(frozen.review_status!==c.review_status) errors.push(`frozen review drift: ${c.id}`);
    if(JSON.stringify(frozen.scene_trace)!==JSON.stringify(c.scene_trace)) errors.push(`frozen scene trace drift: ${c.id}`);
    if(JSON.stringify(frozen.morphology_trace)!==JSON.stringify(c.morphology_trace)) errors.push(`frozen morphology trace drift: ${c.id}`);
  }

  if(errors.length) {
    console.error("Musu moon outer-frame generator check failed:\n"+errors.map(x=>"- "+x).join("\n"));
    process.exit(1);
  }
  console.log("OK: musu moon outer-frame research generator");
  console.log(`Candidates: ${generated.length}; promising=${generated.filter(x=>x.review_status==="promising-but-parse-needed").length}`);
}

if(process.argv.includes("--check")) check();
else process.stdout.write(JSON.stringify(output,null,2)+"\n");
