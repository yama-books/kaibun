import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const seam = readJson("data/seam-grammar-v25.json");
const matrix = readJson("data/modern-seam-role-matrix-v66.json");
const frozenFixture = readJson("data/generated-modern-seam-bridge-v67.json");
const curation = readJson("data/modern-seam-bridge-curation-v68.json");

const shellById = new Map((seam.shells ?? []).map(x => [x.id, x]));
const coreById = new Map((seam.cores ?? []).map(x => [x.id, x]));
const existingByReading = new Map((seam.recipes ?? []).map(x => [x.reading, x]));

function applyShell(inner, shellId) {
  const shell = shellById.get(shellId);
  if (!shell) throw new Error(`Unknown shell: ${shellId}`);
  return {
    reading: shell.left.reading + inner.reading + shell.right.reading,
    display: shell.left.display + inner.display + shell.right.display,
    trace: [...(inner.trace ?? []), shellId],
  };
}

function frameSpec(frameId) {
  const frame = (matrix.frames ?? []).find(x => x.id === frameId);
  if (!frame) throw new Error(`Unknown frame: ${frameId}`);
  return frame;
}

function headStatus(frame, category) {
  if ((frame.allowed_head_categories ?? []).includes(category)) return "accepted";
  if ((frame.review_head_categories ?? []).includes(category)) return "review-needed";
  if ((frame.disallowed_head_categories ?? []).includes(category)) return "hold-semantic-role";
  return "review-needed";
}

function publicQuality(frameId, shellMeta) {
  const isL2 = shellMeta.base_tier === "L2";
  if (frameId === "see") {
    return {
      layer: isL2 ? "L2" : "L1",
      japanese_quality: isL2 ? "A-" : "A",
      weirdness: isL2 ? 3 : 2,
    };
  }
  if (frameId === "loan") {
    return {
      layer: isL2 ? "L2" : "L1",
      japanese_quality: isL2 ? "A-" : "A",
      weirdness: isL2 ? 3 : 3,
    };
  }
  return { layer: "L2", japanese_quality: "B+", weirdness: 4 };
}

const generated = [];
const core = coreById.get(matrix.scope?.core ?? "no");
if (!core) throw new Error("Missing prototype core");

for (const shellMeta of matrix.shell_semantics ?? []) {
  for (const frame of matrix.frames ?? []) {
    let node = {
      reading: core.reading,
      display: core.display,
      trace: [],
    };
    node = applyShell(node, shellMeta.shell_id);

    for (const part of frame.shell_sequence ?? []) {
      if (part === "{inner}") continue;
      node = applyShell(node, part);
    }

    const display = node.display + "。";
    const existing = existingByReading.get(node.reading) ?? null;
    const semanticStatus = headStatus(frame, shellMeta.head_category);
    const quality = publicQuality(frame.id, shellMeta);

    const item = {
      id: `modern-${frame.id}-${shellMeta.shell_id}`,
      operation: "curated-shell-substitution",
      frame: frame.id,
      inner_shell: shellMeta.shell_id,
      head: shellMeta.head,
      head_category: shellMeta.head_category,
      reading: node.reading,
      display,
      strict_palindrome: isPalindrome(node.reading),
      shell_trace: node.trace,
      existing_recipe_id: existing?.id ?? null,
      is_new: !existing,
      semantic_role_trace: {
        frame_role: frame.semantic_role,
        head_category: shellMeta.head_category,
        outcome: existing ? "existing-recipe" : semanticStatus,
      },
      provenance: {
        seam_grammar_version: seam.version,
        semantic_matrix_version: matrix.version,
        lexeme_policy: "existing-shells-only",
      },
      review_status: existing ? "existing-recipe" : semanticStatus,
      public_candidate:
        !existing && semanticStatus === "accepted"
          ? {
              display,
              reading: node.reading,
              family: "研究由来DNA",
              origin: `BRIDGE:SEAM:${frame.id}:${shellMeta.shell_id}`,
              why:
                frame.id === "see"
                  ? `${shellMeta.surface}を「見る対象」として、既存shellを意味役割適合させた新規回文。`
                  : `${shellMeta.surface}の中心語「${shellMeta.head}」を貸借の受け手として許可した新規回文。`,
              japanese_quality: quality.japanese_quality,
              weirdness: quality.weirdness,
              layer: quality.layer,
            }
          : null,
    };
    generated.push(item);
  }
}

const newCandidates = generated.filter(x => x.is_new);
newCandidates.sort((a, b) => a.id.localeCompare(b.id));

const output = {
  version: "0.67",
  bridge_contract_version: "0.65",
  semantic_matrix_version: matrix.version,
  seam_grammar_version: seam.version,
  candidate_count: newCandidates.length,
  summary: {
    accepted: newCandidates.filter(x => x.review_status === "accepted").length,
    review_needed: newCandidates.filter(x => x.review_status === "review-needed").length,
    hold_semantic_role: newCandidates.filter(x => x.review_status === "hold-semantic-role").length,
  },
  candidates: newCandidates,
};

function check() {
  const errors = [];
  if (matrix.version !== "0.66") errors.push(`matrix version ${matrix.version}, expected 0.66`);
  if (output.candidate_count !== 13) errors.push(`new candidate count ${output.candidate_count}, expected 13`);
  if (output.summary.accepted !== 7) errors.push(`accepted count ${output.summary.accepted}, expected 7`);
  if (output.summary.review_needed !== 1) errors.push(`review-needed count ${output.summary.review_needed}, expected 1`);
  if (output.summary.hold_semantic_role !== 5) errors.push(`hold count ${output.summary.hold_semantic_role}, expected 5`);

  if (frozenFixture.version !== "0.67") errors.push(`frozen fixture version ${frozenFixture.version}, expected 0.67`);
  if (frozenFixture.candidate_count !== output.candidate_count) errors.push(`fixture count ${frozenFixture.candidate_count}, generated ${output.candidate_count}`);
  const frozenById = new Map((frozenFixture.candidates ?? []).map(x => [x.id, x]));
  for (const candidate of newCandidates) {
    const frozen = frozenById.get(candidate.id);
    if (!frozen) { errors.push(`missing frozen candidate: ${candidate.id}`); continue; }
    if (frozen.reading !== candidate.reading) errors.push(`frozen reading drift: ${candidate.id}`);
    if (frozen.review_status !== candidate.review_status) errors.push(`frozen status drift: ${candidate.id}`);
  }

  if (curation.version !== "0.68") errors.push(`curation version ${curation.version}, expected 0.68`);
  const generatedAccepted = newCandidates.filter(x => x.review_status === "accepted").map(x => x.id).sort();
  const curatedAccepted = (curation.accepted ?? []).map(x => x.id).sort();
  if (generatedAccepted.join(",") !== curatedAccepted.join(",")) errors.push(`accepted/curation mismatch generated=${generatedAccepted.join(",")} curated=${curatedAccepted.join(",")}`);
  const curatedReview = (curation.review_needed ?? []).map(x => x.id).sort();
  const generatedReview = newCandidates.filter(x => x.review_status === "review-needed").map(x => x.id).sort();
  if (generatedReview.join(",") !== curatedReview.join(",")) errors.push(`review-needed/curation mismatch`);

  for (const c of generated) {
    if (!c.strict_palindrome) errors.push(`non-palindrome: ${c.id}`);
  }
  for (const c of newCandidates.filter(x => x.review_status === "accepted")) {
    if (!c.public_candidate) errors.push(`accepted candidate missing public adapter: ${c.id}`);
  }
  for (const c of newCandidates.filter(x => x.review_status !== "accepted")) {
    if (c.public_candidate) errors.push(`non-accepted candidate exposed to public adapter: ${c.id}`);
  }

  const required = [
    ["modern-see-garden-croc", "accepted"],
    ["modern-see-shop-cicada", "accepted"],
    ["modern-see-morning-sake", "accepted"],
    ["modern-loan-garden-croc", "accepted"],
    ["modern-loan-shop-cicada", "accepted"],
    ["modern-loan-house-ray", "accepted"],
    ["modern-loan-squirrel-pickpocket", "accepted"],
    ["modern-loan-squid-meeting", "review-needed"],
    ["modern-loan-pear-item", "hold-semantic-role"],
    ["modern-loan-morning-sake", "hold-semantic-role"],
    ["modern-loan-sand-eggplant", "hold-semantic-role"],
    ["modern-loan-lie-layer", "hold-semantic-role"],
    ["modern-loan-voice-eco", "hold-semantic-role"],
  ];
  const byId = new Map(newCandidates.map(x => [x.id, x]));
  for (const [id, status] of required) {
    if (byId.get(id)?.review_status !== status) errors.push(`${id} expected ${status}`);
  }

  if (errors.length) {
    console.error("Modern seam bridge prototype check failed:\n" + errors.map(x => "- " + x).join("\n"));
    process.exit(1);
  }
  console.log("OK: modern seam bridge prototype");
  console.log(`New candidates: ${output.candidate_count}`);
  console.log(`Accepted: ${output.summary.accepted}, review: ${output.summary.review_needed}, held: ${output.summary.hold_semantic_role}`);
}

if (process.argv.includes("--check")) check();
else process.stdout.write(JSON.stringify(output, null, 2) + "\n");
