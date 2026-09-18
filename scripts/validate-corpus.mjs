import fs from "node:fs";

const corpus = JSON.parse(fs.readFileSync("data/layered-seeds-v07.json", "utf8"));
const rules = JSON.parse(fs.readFileSync("data/generation-rules-v07.json", "utf8"));
const reverse = s => [...s].reverse().join("");
const isPalindrome = s => s === reverse(s);
const errors = [];

for (const r of corpus.records) {
  if (!r.reading || !isPalindrome(r.reading)) errors.push(`CORPUS non-palindrome: ${r.id ?? "?"} ${r.display ?? ""} / ${r.reading ?? ""}`);
  if (r.layer === "L1" && String(r.subgroup ?? "").includes("telegraphic")) errors.push(`L1 contains telegraphic item: ${r.id} ${r.display}`);
  if (!["L1","L2","L3"].includes(r.layer)) errors.push(`Unknown layer: ${r.id} ${r.layer}`);
}

function checkRule(rule, display, reading) {
  if (!reading || !isPalindrome(reading)) errors.push(`RULE non-palindrome: ${rule.id} / ${display ?? ""} / ${reading ?? ""}`);
}
for (const rule of rules.rules) {
  if (rule.type === "fixed") { checkRule(rule, rule.display, rule.reading); continue; }
  if (rule.type === "particle_pair") {
    for (const v of rule.variants ?? []) checkRule(rule, v[1], rule.left + v[0] + rule.right);
    continue;
  }
  if (rule.type === "mirrored_coordination") {
    for (const v of rule.variants ?? []) checkRule(rule, v[1], rule.reading_pattern.replace("{person}", v[0]));
    continue;
  }
  for (const v of rule.variants ?? []) {
    let reading = rule.reading_pattern ?? "";
    if (reading.includes("{c}")) reading = reading.replace("{c}", v[0]);
    if (reading.includes("{pal_center}")) reading = reading.replace("{pal_center}", v[0]);
    checkRule(rule, v[1], reading);
  }
}
const counts = corpus.records.reduce((a,r)=>(a[r.layer]=(a[r.layer]??0)+1,a),{});
for (const l of ["L1","L2","L3"]) if (counts[l] !== corpus.counts[l]) errors.push(`COUNT mismatch ${l}: declared=${corpus.counts[l]} actual=${counts[l]}`);
if (rules.rule_count !== rules.rules.length) errors.push(`RULE COUNT mismatch: declared=${rules.rule_count} actual=${rules.rules.length}`);

if (errors.length) {
  console.error("\nValidation failed:\n"+errors.map(x=>"- "+x).join("\n"));
  process.exit(1);
}
console.log(`OK: ${corpus.records.length} corpus records, ${rules.rules.length} DNA rules.`);
console.log(`Layers: L1=${counts.L1}, L2=${counts.L2}, L3=${counts.L3}`);
