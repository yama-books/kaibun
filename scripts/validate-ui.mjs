import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);

if (!scripts.length) {
  console.error("No inline <script> block found in index.html");
  process.exit(1);
}

let failed = false;
scripts.forEach((code, i) => {
  try {
    new Function(code);
    console.log(`UI script ${i + 1}: syntax OK`);
  } catch (err) {
    failed = true;
    console.error(`UI script ${i + 1}: syntax error`);
    console.error(err.stack || err);
  }
});

const required = [
  "./data/layered-seeds-v08.json",
  "./data/generation-rules-v08.json",
  "./data/reverse-lexeme-pairs-v09.json",
  "./data/growth-engine-v10.json",
  "./data/seam-grammar-v25.json",
  "./data/modern-bridge-public-v69.json",
  "./data/public-bridge-exposure-policy-v70.json"
];
for (const id of ["lengthMeta","wrapMeta"]) {
  if (!html.includes(`id="${id}"`)) {
    failed = true;
    console.error("index.html is missing runtime metadata element: " + id);
  }
}

if (!html.includes("function standardSeamPool()")) {
  failed = true;
  console.error("index.html is missing standardSeamPool()");
}
if (!html.includes("bridge_probability_cap")) {
  failed = true;
  console.error("index.html does not apply bridge exposure policy");
}

if (!html.includes("function bridgePool()")) {
  failed = true;
  console.error("index.html is missing bridgePool()");
}
if (!html.includes("return uniqueByReading([...base,...bridgePool()])")) {
  failed = true;
  console.error("seamPool() does not merge bridgePool()");
}

for (const ref of required) {
  const path = ref.replace(/^\.\//, "");
  if (!fs.existsSync(path)) {
    failed = true;
    console.error("Missing UI data file: " + path);
  }
  if (!html.includes(ref)) {
    failed = true;
    console.error("index.html does not reference expected data file: " + ref);
  }
}

const exposure = JSON.parse(fs.readFileSync("data/public-bridge-exposure-policy-v70.json", "utf8"));
if (exposure.version !== "0.70") {
  failed = true;
  console.error("Unexpected bridge exposure policy version: " + exposure.version);
}
if (exposure.policy?.bridge_probability_cap !== 0.15) {
  failed = true;
  console.error("Unexpected bridge exposure policy cap: " + exposure.policy?.bridge_probability_cap);
}

if (failed) process.exit(1);
console.log("UI validation OK.");
