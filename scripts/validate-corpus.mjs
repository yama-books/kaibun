import fs from "node:fs";

const corpus = JSON.parse(fs.readFileSync("data/layered-seeds-v06.json", "utf8"));
const rules = JSON.parse(fs.readFileSync("data/generation-rules-v06.json", "utf8"));

const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);
const errors = [];

for (const r of corpus.records) {
  if (!r.reading || !isPalindrome(r.reading)) {
    errors.push(`CORPUS non-palindrome: ${r.id ?? "?"} ${r.display ?? ""} / ${r.reading ?? ""}`);
  }
  if (r.layer === "L1") {
    if (String(r.subgroup ?? "").includes("telegraphic")) {
      errors.push(`L1 contains telegraphic item: ${r.id} ${r.display}`);
    }
    if (String(r.subgroup ?? "").includes("colloquial_identity")) {
      errors.push(`L1 contains L2-style identity item: ${r.id} ${r.display}`);
    }
  }
}

function layerForVariant(rule, v) {
  if (v && ["L1","L2","L3"].includes(v[2])) return v[2];
  return rule.layer;
}
function makeReading(rule, v) {
  if (rule.reading) return rule.reading;
  let s = rule.reading_pattern;
  if (s.includes("{c}")) s = s.replace("{c}", v[0]);
  if (s.includes("{pal_center}")) s = s.replace("{pal_center}", v[0]);
  return s;
}

for (const rule of rules.rules) {
  if (rule.type === "fixed") {
    if (!isPalindrome(rule.reading)) {
      errors.push(`RULE fixed non-palindrome: ${rule.id} / ${rule.reading}`);
    }
  } else {
    for (const v of rule.variants ?? []) {
      const reading = makeReading(rule, v);
      if (!isPalindrome(reading)) {
        errors.push(`RULE variant non-palindrome: ${rule.id} / ${v[1]} / ${reading}`);
      }
      const vl = layerForVariant(rule, v);
      if (!vl) errors.push(`RULE variant missing layer: ${rule.id} / ${v[1]}`);
    }
  }
}

const counts = corpus.records.reduce((a, r) => {
  a[r.layer] = (a[r.layer] ?? 0) + 1;
  return a;
}, {});

for (const layer of ["L1","L2","L3"]) {
  if (counts[layer] !== corpus.counts[layer]) {
    errors.push(`COUNT mismatch ${layer}: declared=${corpus.counts[layer]} actual=${counts[layer]}`);
  }
}

if (errors.length) {
  console.error("\nValidation failed:\n" + errors.map(x => "- " + x).join("\n"));
  process.exit(1);
}

console.log(`OK: ${corpus.records.length} corpus records, ${rules.rules.length} DNA rules.`);
console.log(`Layers: L1=${counts.L1}, L2=${counts.L2}, L3=${counts.L3}`);
