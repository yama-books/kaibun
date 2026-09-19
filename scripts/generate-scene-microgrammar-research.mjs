import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const microgrammar = readJson("data/autumn-moon-microgrammar-v46.json");
const contract = readJson("data/historical-generator-contract-v58.json");
const frozenFixture = readJson("data/generated-scene-microgrammar-v60.json");

function assemble({ A, B, C, D, E }) {
  const reading = A + B + C + D + E + reverse(D) + reverse(C) + reverse(B) + reverse(A);
  return {
    reading,
    meter: [A, B + C, D + E, reverse(D) + reverse(C), reverse(B) + reverse(A)],
  };
}

const fixed = {
  B: microgrammar.fixed_factors?.B?.reading,
  C: microgrammar.fixed_factors?.C?.reading,
  D: microgrammar.fixed_factors?.D?.reading,
};

const outputByReading = new Map((microgrammar.outputs ?? []).map(x => [x.reading, x]));
const generated = [];

for (const A of microgrammar.variable_factors?.A ?? []) {
  for (const E of microgrammar.variable_factors?.E ?? []) {
    const factors = { A: A.reading, B: fixed.B, C: fixed.C, D: fixed.D, E: E.reading };
    const built = assemble(factors);
    const fixture = outputByReading.get(built.reading);
    if (!fixture) {
      throw new Error(`Generated scene-family output missing from v0.46 fixture: A=${A.id} E=${E.id}`);
    }

    generated.push({
      id: fixture.id,
      operation: "scene-microgrammar",
      scene_id: microgrammar.scene?.id,
      A_option: A.id,
      E_option: E.id,
      factors,
      reading: built.reading,
      meter: built.meter,
      strict_palindrome: isPalindrome(built.reading),
      kind: fixture.kind,
      prior_review: fixture.prior_review,
      provenance: fixture.provenance,
      gate_trace: {
        structural_palindrome: { status: "pass" },
        local_attestation: {
          status: "pass",
          reason: "AB/BC/CD/DE combinations are explicitly attested under v0.46 invariants",
        },
        morphology: {
          status: "pass-or-conditional",
          B: microgrammar.fixed_factors?.B?.seam ?? null,
          D: microgrammar.fixed_factors?.D?.seam ?? null,
        },
        scene: {
          status: "reviewed-family",
          scene_id: microgrammar.scene?.id,
          evidence_basis: microgrammar.scene?.evidence_basis,
        },
        deep_review: {
          status: fixture.prior_review?.status ?? "source-member",
        },
      },
    });
  }
}

generated.sort((a, b) => a.id.localeCompare(b.id));

const output = {
  version: "0.60",
  generator_contract_version: contract.version,
  source_microgrammar_version: microgrammar.version,
  operation: "scene-microgrammar",
  scene_id: microgrammar.scene?.id,
  candidate_count: generated.length,
  candidates: generated,
};

function check() {
  const errors = [];
  if (contract.version !== "0.58") errors.push(`contract version is ${contract.version}, expected 0.58`);
  if (microgrammar.version !== "0.46") errors.push(`microgrammar version is ${microgrammar.version}, expected 0.46`);
  if (output.candidate_count !== 4) errors.push(`candidate count ${output.candidate_count}, expected 4`);

  const ids = generated.map(x => x.id).sort();
  const expectedIds = (microgrammar.outputs ?? []).map(x => x.id).sort();
  if (ids.join(",") !== expectedIds.join(",")) {
    errors.push(`output IDs differ from v0.46: generated=${ids.join(",")} expected=${expectedIds.join(",")}`);
  }

  const frozenIds = (frozenFixture.candidates ?? []).map(x => x.id).sort();
  if (frozenFixture.version !== "0.60") errors.push(`frozen fixture version is ${frozenFixture.version}, expected 0.60`);
  if (frozenFixture.candidate_count !== output.candidate_count) errors.push(`frozen fixture count ${frozenFixture.candidate_count}, generated ${output.candidate_count}`);
  if (frozenIds.join(",") !== ids.join(",")) errors.push(`frozen IDs differ: frozen=${frozenIds.join(",")} generated=${ids.join(",")}`);
  const frozenById = new Map((frozenFixture.candidates ?? []).map(x => [x.id, x]));
  for (const candidate of generated) {
    const frozen = frozenById.get(candidate.id);
    if (!frozen) continue;
    if (frozen.reading !== candidate.reading) errors.push(`frozen reading drift: ${candidate.id}`);
    if (JSON.stringify(frozen.gate_trace) !== JSON.stringify(candidate.gate_trace)) errors.push(`frozen gate trace drift: ${candidate.id}`);
  }

  for (const candidate of generated) {
    if (!candidate.strict_palindrome) errors.push(`non-palindrome: ${candidate.id}`);
    if ((candidate.meter ?? []).map(x => [...x].length).join(",") !== "5,7,5,7,7") {
      errors.push(`meter mismatch: ${candidate.id}`);
    }
  }

  const sourceCount = generated.filter(x => x.kind === "historical-source").length;
  const novelCount = generated.filter(x => x.kind === "novel-cento").length;
  if (sourceCount !== 1) errors.push(`historical source count ${sourceCount}, expected 1`);
  if (novelCount !== 3) errors.push(`novel count ${novelCount}, expected 3`);

  if (errors.length) {
    console.error("Scene microgrammar generator check failed:\n" + errors.map(x => "- " + x).join("\n"));
    process.exit(1);
  }

  console.log("OK: scene microgrammar research generator");
  console.log(`Scene: ${output.scene_id}`);
  console.log(`Candidates: ${output.candidate_count}`);
}

if (process.argv.includes("--check")) {
  check();
} else {
  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
}
