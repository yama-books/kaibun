import fs from "node:fs";

const readJson = p => JSON.parse(fs.readFileSync(p, "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);

const pub = readJson("data/modern-bridge-public-v69.json");
const curation = readJson("data/modern-seam-bridge-curation-v68.json");
const seeds = readJson("data/layered-seeds-v08.json");
const seams = readJson("data/seam-grammar-v25.json");

const errors = [];
if (pub.version !== "0.69") errors.push(`public bridge version ${pub.version}, expected 0.69`);
if (curation.version !== "0.68") errors.push(`curation version ${curation.version}, expected 0.68`);
if ((pub.candidates ?? []).length !== 7) errors.push("public bridge must contain exactly 7 candidates");

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
const publicResearchIds = (pub.candidates ?? []).map(x => x.research_id).sort();
const curatedIds = [...curatedById.keys()].sort();
if (publicResearchIds.join(",") !== curatedIds.join(",")) {
  errors.push(`public whitelist differs from curation: public=${publicResearchIds.join(",")} curated=${curatedIds.join(",")}`);
}
for (const c of pub.candidates ?? []) {
  const cur = curatedById.get(c.research_id);
  if (!cur) continue;
  if (cur.reading !== c.reading) errors.push(`curation reading mismatch: ${c.id}`);
  if (cur.display !== c.display) errors.push(`curation display mismatch: ${c.id}`);
  if (cur.layer !== c.layer) errors.push(`curation layer mismatch: ${c.id}`);
  if (cur.japanese_quality !== c.japanese_quality) errors.push(`curation quality mismatch: ${c.id}`);
  if (cur.weirdness !== c.weirdness) errors.push(`curation weirdness mismatch: ${c.id}`);
}

const excluded = new Set(pub.excluded_research_ids ?? []);
for (const c of pub.candidates ?? []) {
  if (excluded.has(c.research_id)) errors.push(`excluded candidate leaked into public whitelist: ${c.research_id}`);
}

const seedReadings = new Set((seeds.records ?? []).map(x => x.reading));
const seamReadings = new Set((seams.recipes ?? []).map(x => x.reading));
for (const c of pub.candidates ?? []) {
  if (seedReadings.has(c.reading)) errors.push(`bridge duplicates seed: ${c.id}`);
  if (seamReadings.has(c.reading)) errors.push(`bridge duplicates seam recipe: ${c.id}`);
}

const layerCounts = (pub.candidates ?? []).reduce((a,c)=>(a[c.layer]=(a[c.layer]??0)+1,a),{});
if ((pub.counts?.L1 ?? 0) !== (layerCounts.L1 ?? 0)) errors.push("L1 count mismatch");
if ((pub.counts?.L2 ?? 0) !== (layerCounts.L2 ?? 0)) errors.push("L2 count mismatch");

if (errors.length) {
  console.error("Public bridge validation failed:\n" + errors.map(x => "- " + x).join("\n"));
  process.exit(1);
}
console.log(`OK: public bridge whitelist ${pub.candidates.length} candidates (L1=${layerCounts.L1??0}, L2=${layerCounts.L2??0})`);
