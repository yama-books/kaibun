import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const family = readJson("data/naha-outer-frame-exchange-v62.json");
const schema = readJson("data/historical-research-candidate-schema-v61.json");
const frozenFixture = readJson("data/generated-naha-outer-frame-v63.json");

function assemble({A,B,C,D,E}) {
  const reading = A+B+C+D+E+reverse(D)+reverse(C)+reverse(B)+reverse(A);
  return {
    reading,
    meter:[A,B+C,D+E,reverse(D)+reverse(C),reverse(B)+reverse(A)],
  };
}

const sourceIds = Object.keys(family.source_contexts ?? {});
const outputById = new Map((family.outputs ?? []).map(x => [x.id, x]));
const generated=[];

for (const hostId of sourceIds) {
  const host = family.source_contexts[hostId];
  for (const aSourceId of sourceIds) {
    const donor = family.source_contexts[aSourceId];
    const factors = {
      A: donor.factors.A,
      B: host.factors.B,
      C: host.factors.C,
      D: host.factors.D,
      E: host.factors.E,
    };
    const built = assemble(factors);
    const fixture = [...outputById.values()].find(x => {
      const expectedHost = x.host;
      const expectedA = x.A_source;
      return expectedHost===hostId && expectedA===aSourceId;
    });
    if (!fixture) throw new Error(`Missing v0.62 fixture for host=${hostId} A=${aSourceId}`);

    const isHistorical = hostId===aSourceId;
    const reviewStatus = isHistorical
      ? "historical-source"
      : fixture.research_review?.status === "promising-but-linguistic-review-needed"
        ? "deep-review-supported"
        : fixture.research_review?.status ?? "deep-review-needed";

    generated.push({
      id: fixture.id,
      operation:"shared-B-outer-frame-swap",
      reading:built.reading,
      meter:built.meter,
      factors,
      strict_palindrome:isPalindrome(built.reading),
      host_source_id:hostId,
      donor_source_ids:isHistorical?[]:[aSourceId],
      provenance:{
        host_middle_source:hostId,
        outer_frame_A_source:aSourceId,
        B_shared_reading:family.invariant?.B,
        B_reverse_reading:family.invariant?.reverse_B,
      },
      attestation_trace:{
        donor_AB_attested:true,
        host_BC_attested:true,
        host_CD_attested:true,
        host_DE_attested:true,
        source_pair_trusted:
          host.source_group==="trusted" && donor.source_group==="trusted",
      },
      morphology_trace:{
        moved_slots:["A"],
        fixed_slots:["B","C","D","E"],
        shared_B:family.invariant?.B,
        reverse_B:family.invariant?.reverse_B,
        B_confidence:family.invariant?.confidence,
        B_transferable:family.invariant?.transferable,
        B_signature:family.invariant?.morphology_signature,
      },
      scene_trace:{
        host_broad_field:host.broad_field,
        donor_broad_field:donor.broad_field,
        host_primary_field:host.primary_field,
        donor_primary_field:donor.primary_field,
        status:
          host.broad_field===donor.broad_field ? "broad-pass" : "hold-scene-mismatch",
      },
      semantic_role_trace:{
        status:isHistorical
          ? "source-member"
          : fixture.research_review?.status==="promising-but-linguistic-review-needed"
            ? "compatible-by-reviewed-context"
            : fixture.research_review?.status==="hold-semantic-role-mismatch"
              ? "incompatible-for-this-host"
              : "review-needed",
        basis:fixture.research_review?.reasons ?? [],
      },
      source_confidence_trace:{
        host:host.source_group,
        donor:donor.source_group,
        host_source_confidence:host.source_confidence,
        donor_source_confidence:donor.source_confidence,
        source_image_needed:false,
      },
      review_status:reviewStatus,
      cautions:fixture.research_review?.cautions ?? [],
    });
  }
}

generated.sort((a,b)=>a.id.localeCompare(b.id));

const output={
  version:"0.63",
  source_family_version:family.version,
  common_schema_version:schema.version,
  operation:"shared-B-outer-frame-swap",
  family:"naha-spring-plants",
  candidate_count:generated.length,
  candidates:generated,
};

function check(){
  const errors=[];
  if(family.version!=="0.62") errors.push(`family version ${family.version}, expected 0.62`);
  if(schema.version!=="0.61") errors.push(`schema version ${schema.version}, expected 0.61`);
  if(generated.length!==4) errors.push(`candidate count ${generated.length}, expected 4`);
  const expectedIds=(family.outputs??[]).map(x=>x.id).sort().join(",");
  const ids=generated.map(x=>x.id).sort().join(",");
  if(ids!==expectedIds) errors.push(`IDs mismatch generated=${ids} expected=${expectedIds}`);
  if(frozenFixture.version!=="0.63") errors.push(`frozen fixture version ${frozenFixture.version}, expected 0.63`);
  if(frozenFixture.candidate_count!==generated.length) errors.push(`frozen fixture count ${frozenFixture.candidate_count}, generated ${generated.length}`);
  const frozenById=new Map((frozenFixture.candidates??[]).map(x=>[x.id,x]));
  for(const c of generated){
    const frozen=frozenById.get(c.id);
    if(!frozen) { errors.push(`missing frozen candidate: ${c.id}`); continue; }
    if(frozen.reading!==c.reading) errors.push(`frozen reading drift: ${c.id}`);
    if(frozen.review_status!==c.review_status) errors.push(`frozen review drift: ${c.id}`);
    if(JSON.stringify(frozen.semantic_role_trace)!==JSON.stringify(c.semantic_role_trace)) errors.push(`frozen role trace drift: ${c.id}`);
  }
  for(const c of generated){
    for(const field of schema.candidate_required_fields??[]) if(!(field in c)) errors.push(`missing field ${field}: ${c.id}`);
    if(!c.strict_palindrome) errors.push(`non-palindrome: ${c.id}`);
    if(c.meter.map(x=>[...x].length).join(",")!=="5,7,5,7,7") errors.push(`meter mismatch: ${c.id}`);
  }
  const h18=generated.find(x=>x.id==="hybrid-018");
  const h20=generated.find(x=>x.id==="hybrid-020");
  if(h18?.review_status!=="deep-review-supported") errors.push("hybrid-018 status changed");
  if(h20?.review_status!=="hold-semantic-role-mismatch") errors.push("hybrid-020 status changed");
  if(errors.length){
    console.error("Naha outer-frame generator check failed:\n"+errors.map(x=>"- "+x).join("\n"));
    process.exit(1);
  }
  console.log("OK: naha outer-frame research generator");
  console.log(`Candidates: ${generated.length}`);
}

if(process.argv.includes("--check")) check();
else process.stdout.write(JSON.stringify(output,null,2)+"\n");
