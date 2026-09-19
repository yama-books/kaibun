import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const fiveVar = readJson("data/tanka-five-variable-grammar-v34.json");
const semanticFields = readJson("data/historical-semantic-fields-v32.json");
const seamSignatures = readJson("data/historical-seam-signatures-v36.json");
const hybrids = readJson("data/historical-factor-hybrids-v35.json");
const curatedPipeline = readJson("data/central-pivot-candidate-pipeline-v57.json");
const contract = readJson("data/historical-generator-contract-v58.json");
const frozenFixture = readJson("data/generated-central-pivot-research-v59.json");

const semanticById = new Map((semanticFields.entries ?? []).map(x => [x.id, x]));
const hybridByReading = new Map((hybrids.candidates ?? []).map(x => [x.reading, x]));
const curatedById = new Map((curatedPipeline.results ?? []).map(x => [x.id, x]));

function assemble({ A, B, C, D, E }) {
  const reading = A + B + C + D + E + reverse(D) + reverse(C) + reverse(B) + reverse(A);
  return {
    reading,
    meter: [A, B + C, D + E, reverse(D) + reverse(C), reverse(B) + reverse(A)],
  };
}

function gateTrace(stage, dSignature) {
  const scene =
    stage === "hold-scene-mismatch"
      ? { status: "hold", reason: "curated-v57 scene mismatch" }
      : { status: "pass-or-reviewed", reason: "curated-v57 advanced beyond scene gate" };

  let semanticRole;
  if (stage === "hold-scene-mismatch") {
    semanticRole = { status: "skipped", reason: "scene gate stopped candidate first" };
  } else if (stage === "hold-semantic-role-incompatible") {
    semanticRole = { status: "hold", reason: "curated-v57 role incompatibility" };
  } else if (stage === "deep-review-needed-role") {
    semanticRole = { status: "review-needed", reason: "curated-v57 role evidence incomplete" };
  } else if (stage === "deep-review-supported") {
    semanticRole = { status: "compatible-by-reviewed-context", reason: "curated-v57 support" };
  } else {
    semanticRole = { status: "unknown", reason: "unrecognized curated stage" };
  }

  return {
    structural_palindrome: { status: "pass" },
    historical_attestation: {
      status: "pass",
      reason: "host A/B/C/D remains intact; donor D+E is attested in donor source",
    },
    morphology: {
      status: dSignature ? "pass-or-conditional" : "hold",
      D_confidence: dSignature?.confidence ?? null,
      D_transferable: dSignature?.transferable ?? null,
      D_signature: dSignature?.signature ?? null,
    },
    scene,
    semantic_role: semanticRole,
    deep_review: { status: stage },
  };
}

const samples = fiveVar.samples ?? [];
const groups = new Map();
for (const sample of samples) {
  const list = groups.get(sample.D) ?? [];
  list.push(sample);
  groups.set(sample.D, list);
}

const generated = [];
for (const [D, group] of groups) {
  if (group.length < 2) continue;
  const distinctE = new Set(group.map(x => x.E));
  if (distinctE.size < 2) continue;

  for (const host of group) {
    for (const donor of group) {
      if (host.id === donor.id || host.E === donor.E) continue;

      const factors = { A: host.A, B: host.B, C: host.C, D: host.D, E: donor.E };
      const built = assemble(factors);
      const existing = hybridByReading.get(built.reading);
      if (!existing) {
        throw new Error(`Generated E-swap has no v0.35 candidate: host=${host.id} donor=${donor.id}`);
      }
      const curated = curatedById.get(existing.id);
      if (!curated) {
        throw new Error(`Generated E-swap missing v0.57 gate fixture: ${existing.id}`);
      }

      const dSignature = seamSignatures.D2?.[D] ?? null;
      const hostSemantic = semanticById.get(host.id) ?? null;
      const donorSemantic = semanticById.get(donor.id) ?? null;

      generated.push({
        id: existing.id,
        operation: "central-E-swap",
        host_source_id: host.id,
        donor_source_id: donor.id,
        factors,
        changed_factor: {
          slot: "E",
          host_reading: host.E,
          donor_reading: donor.E,
        },
        reading: built.reading,
        meter: built.meter,
        strict_palindrome: isPalindrome(built.reading),
        provenance: {
          host_group: host.group,
          donor_group: donor.group,
          host_title: host.title,
          donor_title: donor.title,
        },
        semantic_context: {
          host_broad_field: hostSemantic?.broad_field ?? null,
          host_primary_field: hostSemantic?.primary_field ?? null,
          donor_broad_field: donorSemantic?.broad_field ?? null,
          donor_primary_field: donorSemantic?.primary_field ?? null,
        },
        gate_trace: gateTrace(curated.stage, dSignature),
        final_research_stage: curated.stage,
      });
    }
  }
}

generated.sort((a, b) => a.id.localeCompare(b.id));

const output = {
  version: "0.59",
  generator_contract_version: contract.version,
  operation: "central-E-swap",
  candidate_count: generated.length,
  candidates: generated,
};

function check() {
  const errors = [];
  if (contract.version !== "0.58") errors.push(`contract version is ${contract.version}, expected 0.58`);
  if (output.candidate_count !== 12) errors.push(`candidate count ${output.candidate_count}, expected 12`);

  const generatedIds = generated.map(x => x.id).sort();
  const fixtureIds = (curatedPipeline.results ?? []).map(x => x.id).sort();
  if (generatedIds.join(",") !== fixtureIds.join(",")) {
    errors.push(`candidate IDs differ from v0.57 fixture: generated=${generatedIds.join(",")} fixture=${fixtureIds.join(",")}`);
  }

  const frozenIds = (frozenFixture.candidates ?? []).map(x => x.id).sort();
  if (frozenFixture.version !== "0.59") errors.push(`frozen fixture version is ${frozenFixture.version}, expected 0.59`);
  if (frozenFixture.candidate_count !== output.candidate_count) errors.push(`frozen fixture count ${frozenFixture.candidate_count}, generated ${output.candidate_count}`);
  if (frozenIds.join(",") !== generatedIds.join(",")) errors.push(`frozen fixture IDs differ: frozen=${frozenIds.join(",")} generated=${generatedIds.join(",")}`);
  const frozenById = new Map((frozenFixture.candidates ?? []).map(x => [x.id, x]));
  for (const candidate of generated) {
    const frozen = frozenById.get(candidate.id);
    if (!frozen) continue;
    if (frozen.reading !== candidate.reading) errors.push(`frozen reading drift: ${candidate.id}`);
    if (frozen.final_research_stage !== candidate.final_research_stage) errors.push(`frozen stage drift: ${candidate.id}`);
    if (JSON.stringify(frozen.gate_trace) !== JSON.stringify(candidate.gate_trace)) errors.push(`frozen gate trace drift: ${candidate.id}`);
  }

  for (const candidate of generated) {
    if (!candidate.strict_palindrome) errors.push(`non-palindrome: ${candidate.id}`);
    if (candidate.reading.length === 0) errors.push(`empty reading: ${candidate.id}`);
    if ((candidate.meter ?? []).map(x => [...x].length).join(",") !== "5,7,5,7,7") {
      errors.push(`meter mismatch: ${candidate.id}`);
    }
  }

  const stages = generated.reduce((acc, x) => {
    acc[x.final_research_stage] = (acc[x.final_research_stage] ?? 0) + 1;
    return acc;
  }, {});
  if ((stages["deep-review-supported"] ?? 0) !== 2) errors.push("expected 2 deep-review-supported");
  if ((stages["deep-review-needed-role"] ?? 0) !== 1) errors.push("expected 1 deep-review-needed-role");
  if ((stages["hold-semantic-role-incompatible"] ?? 0) !== 1) errors.push("expected 1 role-incompatible hold");
  if ((stages["hold-scene-mismatch"] ?? 0) !== 8) errors.push("expected 8 scene-mismatch holds");

  if (errors.length) {
    console.error("Historical central-pivot generator check failed:\n" + errors.map(x => "- " + x).join("\n"));
    process.exit(1);
  }

  console.log("OK: historical central-pivot research generator");
  console.log(`Candidates: ${output.candidate_count}`);
  console.log(`Stages: ${JSON.stringify(stages)}`);
}

if (process.argv.includes("--check")) {
  check();
} else {
  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
}
