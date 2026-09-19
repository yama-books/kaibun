import fs from "node:fs";

const readJson = p => JSON.parse(fs.readFileSync(p, "utf8"));

const growth = readJson("data/growth-engine-v10.json");
const gate = readJson("data/growth-wrapper-role-gate-v72.json");
const frozen = readJson("data/growth-wrapper-role-simulation-v91.json");

const ruleById = new Map();
for (const rule of gate.wrapper_rules ?? []) {
  for (const id of rule.match_ids ?? []) ruleById.set(id, rule);
}

function conflicts(wrapper, item) {
  return (wrapper.outer_lexemes ?? []).some(l =>
    (l.display && String(item.display ?? "").includes(l.display)) ||
    (l.reading && String(item.reading ?? "").includes(l.reading))
  );
}

function hasAny(text, cues) {
  return (cues ?? []).some(cue => String(text ?? "").includes(cue));
}

function roleAllowed(wrapper, family, stage) {
  const rule = ruleById.get(wrapper.id);
  if (!rule) return true;
  const c = rule.auto_condition ?? {};

  if (c.type === "interrogative-evidence") {
    return hasAny(stage.display, gate.context_detection?.interrogative_evidence ?? ["？","?"]);
  }
  if (c.type === "lexical-cue") {
    return hasAny(stage.display, c.cues ?? gate.context_detection?.decision_lexical_cues ?? []);
  }
  if (c.type === "dimension") {
    return (c.allowed ?? []).includes(family.dimension);
  }
  return true;
}

const contexts = [];
const gatedTop5Frequency = {};
const removedFrequency = {};

for (const family of growth.narrative_families ?? []) {
  const stage = (family.stages ?? []).at(-1);
  if (!stage) continue;

  const current = [...(growth.sentence_level_wrappers ?? [])]
    .filter(w => !conflicts(w, stage))
    .sort((a,b) => (a.auto_priority ?? 999) - (b.auto_priority ?? 999));

  const gated = current.filter(w => roleAllowed(w, family, stage));
  const currentTop5 = current.slice(0,5).map(w => w.id);
  const gatedTop5 = gated.slice(0,5).map(w => w.id);

  for (const id of gatedTop5) gatedTop5Frequency[id] = (gatedTop5Frequency[id] ?? 0) + 1;
  for (const w of current.filter(w => !roleAllowed(w, family, stage))) {
    removedFrequency[w.id] = (removedFrequency[w.id] ?? 0) + 1;
  }

  contexts.push({
    family: family.id,
    dimension: family.dimension,
    layer: family.layer,
    final_display: stage.display,
    current_eligible_count: current.length,
    gated_eligible_count: gated.length,
    current_top5: currentTop5,
    gated_top5: gatedTop5,
  });
}

const summary = {
  family_count: contexts.length,
  min_gated_eligible_count: Math.min(...contexts.map(x => x.gated_eligible_count)),
  changed_top5_count: contexts.filter(x => x.current_top5.join(",") !== x.gated_top5.join(",")).length,
  declarative_ask_top5_count: contexts.filter(x => {
    const hasQuestion = hasAny(x.final_display, gate.context_detection?.interrogative_evidence ?? ["？","?"]);
    return !hasQuestion && x.gated_top5.some(id => id === "ask" || id === "ask-topic");
  }).length,
  non_quote_specialized_top5_count: contexts.filter(x =>
    x.dimension !== "引用・伝聞" &&
    x.gated_top5.some(id => ["write-topic","read-muyo-topic","ack-topic","tell-topic","reply-topic"].includes(id))
  ).length,
  gated_top5_frequency: Object.entries(gatedTop5Frequency).sort((a,b) => b[1] - a[1]),
  removed_frequency: Object.entries(removedFrequency).sort((a,b) => b[1] - a[1]),
};

const output = {
  version: "0.73",
  growth_version: growth.version,
  gate_version: gate.version,
  public_behavior_changed: false,
  summary,
  contexts,
};

function check() {
  const errors = [];
  if (growth.version !== "0.31") errors.push(`growth version ${growth.version}, expected 0.31`);
  if (gate.version !== "0.72") errors.push(`gate version ${gate.version}, expected 0.72`);
  if (summary.family_count !== 53) errors.push(`family count ${summary.family_count}, expected 53`);
  if (summary.min_gated_eligible_count < 5) errors.push(`minimum gated eligible count ${summary.min_gated_eligible_count}, expected >=5`);
  if (summary.declarative_ask_top5_count !== 0) errors.push(`declarative ask top5 count ${summary.declarative_ask_top5_count}, expected 0`);
  if (summary.non_quote_specialized_top5_count !== 0) errors.push(`non-quote specialized top5 count ${summary.non_quote_specialized_top5_count}, expected 0`);
  if (summary.changed_top5_count < 30) errors.push(`changed top5 count ${summary.changed_top5_count}, expected >=30`);
  if (frozen.version !== "0.91") errors.push(`frozen simulation version ${frozen.version}, expected 0.91`);
  for (const key of ["family_count","min_gated_eligible_count","changed_top5_count","declarative_ask_top5_count","non_quote_specialized_top5_count"]) {
    if (frozen.summary?.[key] !== summary[key]) errors.push(`frozen summary drift ${key}: frozen=${frozen.summary?.[key]} generated=${summary[key]}`);
  }
  const frozenByFamily = new Map((frozen.contexts ?? []).map(x => [x.family, x]));
  for (const ctx of contexts) {
    const prev = frozenByFamily.get(ctx.family);
    if (!prev) { errors.push(`missing frozen context: ${ctx.family}`); continue; }
    if (prev.gated_eligible_count !== ctx.gated_eligible_count) errors.push(`gated pool drift: ${ctx.family}`);
    if (JSON.stringify(prev.gated_top5) !== JSON.stringify(ctx.gated_top5)) errors.push(`gated top5 drift: ${ctx.family}`);
  }

  if (errors.length) {
    console.error("Growth wrapper role-gate simulation failed:\n" + errors.map(x => "- " + x).join("\n"));
    process.exit(1);
  }
  console.log("OK: growth wrapper role-gate simulation");
  console.log(`Families: ${summary.family_count}`);
  console.log(`Changed top5: ${summary.changed_top5_count}`);
  console.log(`Minimum gated pool: ${summary.min_gated_eligible_count}`);
}

if (process.argv.includes("--check")) check();
else process.stdout.write(JSON.stringify(output, null, 2) + "\n");
