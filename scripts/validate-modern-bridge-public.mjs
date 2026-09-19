import fs from "node:fs";

const readJson = p => JSON.parse(fs.readFileSync(p, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const pub = readJson("data/modern-bridge-public-v69.json");
const curation = readJson("data/modern-seam-bridge-curation-v68.json");
const seeds = readJson("data/layered-seeds-v08.json");
const seams = readJson("data/seam-grammar-v25.json");
const rules = readJson("data/generation-rules-v08.json");
const pairs = readJson("data/reverse-lexeme-pairs-v09.json");

const errors = [];
if (pub.version !== "0.69") errors.push(`public bridge version ${pub.version}, expected 0.69`);
if (curation.version !== "0.68") errors.push(`curation version ${curation.version}, expected 0.68`);
if ((pub.candidates ?? []).length !== 6) errors.push("public bridge must contain exactly 6 unique candidates");

const declaredTotal = pub.counts?.total ?? -1;
if (declaredTotal !== (pub.candidates ?? []).length) errors.push("public bridge count mismatch");

const required = ["id","research_id","display","reading","family","layer","origin","why","japanese_quality","weirdness"];
const readings = new Set();
for (const c of pub.candidates ?? []) {
  for (const k of required) if (!(k in c)) errors.push(`missing ${k}: ${c.id ?? "?"}`);
  if (!isPalindrome(c.reading)) errors.push(`non-palindrome: ${c.id}`);
  if (readings.has(c.reading)) errors.push(`duplicate bridge reading: ${c.id}`);
  readings.add(c.reading);
  if (!["L1","L2"].includes(c.layer)) errors.push(`invalid bridge layer: ${c.id} ${c.layer}`);
  if (!String(c.origin ?? "").startsWith("BRIDGE:")) errors.push(`invalid bridge origin: ${c.id}`);
}

const curatedById = new Map((curation.accepted ?? []).map(x => [x.id, x]));
const duplicateResearchIds = new Set(
  (curation.accepted ?? []).filter(x => x.public_duplicate).map(x => x.id)
);
const publicResearchIds = (pub.candidates ?? []).map(x => x.research_id).sort();
const curatedUniqueIds = [...curatedById.keys()].filter(id => !duplicateResearchIds.has(id)).sort();
if (publicResearchIds.join(",") !== curatedUniqueIds.join(",")) {
  errors.push(`public whitelist differs from deduplicated curation: public=${publicResearchIds.join(",")} curatedUnique=${curatedUniqueIds.join(",")}`);
}

for (const c of pub.candidates ?? []) {
  const cur = curatedById.get(c.research_id);
  if (!cur) continue;
  if (cur.reading !== c.reading) errors.push(`curation reading mismatch: ${c.id}`);
  if (cur.display.replaceAll("、","") !== c.display.replaceAll("、","")) errors.push(`curation display mismatch: ${c.id}`);
  if (cur.layer !== c.layer) errors.push(`curation layer mismatch: ${c.id}`);
  if (cur.japanese_quality !== c.japanese_quality) errors.push(`curation quality mismatch: ${c.id}`);
  if (cur.weirdness !== c.weirdness) errors.push(`curation weirdness mismatch: ${c.id}`);
}

if ((pub.existing_public_duplicates ?? []).length !== duplicateResearchIds.size) {
  errors.push("public duplicate metadata count mismatch");
}
for (const d of pub.existing_public_duplicates ?? []) {
  if (!duplicateResearchIds.has(d.research_id)) errors.push(`unexpected public duplicate metadata: ${d.research_id}`);
}

const excluded = new Set(pub.excluded_research_ids ?? []);
for (const c of pub.candidates ?? []) {
  if (excluded.has(c.research_id)) errors.push(`excluded candidate leaked into public whitelist: ${c.research_id}`);
}

const existingReadings = new Map();
const addExisting = (reading, source) => {
  if (!reading) return;
  const list = existingReadings.get(reading) ?? [];
  list.push(source);
  existingReadings.set(reading, list);
};

for (const x of seeds.records ?? []) addExisting(x.reading, `seed:${x.id}`);
for (const x of seams.recipes ?? []) addExisting(x.reading, `seam:${x.id}`);

for (const rule of rules.rules ?? []) {
  if (rule.type === "fixed") {
    addExisting(rule.reading, `rule:${rule.id}`);
    continue;
  }
  if (rule.type === "particle_pair") {
    for (const v of rule.variants ?? []) addExisting(rule.left + v[0] + rule.right, `rule:${rule.id}`);
    continue;
  }
  if (rule.type === "mirrored_coordination") {
    for (const v of rule.variants ?? []) addExisting(rule.reading_pattern.replace("{person}", v[0]), `rule:${rule.id}`);
    continue;
  }
  if (rule.type === "recursive_kinship") {
    const levels = [rule.bases.map(x => ({...x, depth: 0}))];
    for (let d = 1; d <= rule.max_depth; d++) {
      const cur = [];
      for (const w of rule.wrappers) for (const inner of levels[d - 1]) {
        if (rule.constraints?.no_same_adjacent_relation && w.reading === inner.edge) continue;
        cur.push({
          reading: w.reading + "の" + inner.reading + "の" + w.reading,
          display: w.display + "の" + inner.display + "の" + w.display,
          depth: d,
          edge: w.reading,
        });
      }
      levels.push(cur);
    }
    for (const np of levels.flat()) for (const frame of rule.frames) {
      addExisting(frame.left + np.reading + frame.right, `recursive:${rule.id}`);
    }
    continue;
  }
  for (const v of rule.variants ?? []) {
    let reading = rule.reading_pattern ?? "";
    if (reading.includes("{c}")) reading = reading.replace("{c}", v[0]);
    if (reading.includes("{pal_center}")) reading = reading.replace("{pal_center}", v[0]);
    addExisting(reading, `rule:${rule.id}`);
  }
}

for (const pair of pairs.pairs ?? []) {
  if (pair.right.reading !== reverse(pair.left.reading)) continue;
  for (const v of pair.variants ?? []) {
    addExisting(pair.left.reading + v.particle + pair.right.reading, `pair:${pair.id}`);
  }
}

for (const c of pub.candidates ?? []) {
  const hits = existingReadings.get(c.reading) ?? [];
  if (hits.length) errors.push(`bridge duplicates existing public candidate: ${c.id} -> ${hits.join("|")}`);
}

const layerCounts = (pub.candidates ?? []).reduce((a,c)=>(a[c.layer]=(a[c.layer]??0)+1,a),{});
if ((pub.counts?.L1 ?? 0) !== (layerCounts.L1 ?? 0)) errors.push("L1 count mismatch");
if ((pub.counts?.L2 ?? 0) !== (layerCounts.L2 ?? 0)) errors.push("L2 count mismatch");
if ((layerCounts.L1 ?? 0) !== 3 || (layerCounts.L2 ?? 0) !== 3) {
  errors.push(`expected bridge layers L1=3 L2=3, got L1=${layerCounts.L1??0} L2=${layerCounts.L2??0}`);
}

if (errors.length) {
  console.error("Public bridge validation failed:\n" + errors.map(x => "- " + x).join("\n"));
  process.exit(1);
}
console.log(`OK: public bridge whitelist ${pub.candidates.length} unique candidates (L1=${layerCounts.L1??0}, L2=${layerCounts.L2??0})`);
