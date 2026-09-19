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
  "./data/public-bridge-exposure-policy-v70.json",
  "./data/growth-wrapper-role-gate-v72.json",
  "./data/growth-wrapper-role-public-v74.json"
];
for (const id of ["lengthMeta","wrapMeta"]) {
  if (!html.includes(`id="${id}"`)) {
    failed = true;
    console.error("index.html is missing runtime metadata element: " + id);
  }
}

for (const fn of ["nounCompatibleSentenceWrappers","autoCompatibleSentenceWrappers","wrapperRoleAllowed"]) {
  if (!html.includes("function " + fn + "()") && !html.includes("function " + fn + "(")) {
    failed = true;
    console.error("index.html is missing wrapper role function: " + fn);
  }
}
if (!html.includes('auto.textContent="自動（名詞重複回避＋意味役割）"')) {
  failed = true;
  console.error("automatic wrapper UI does not advertise semantic-role gating");
}
if (!html.includes('const list=nounCompatibleSentenceWrappers();')) {
  failed = true;
  console.error("manual wrapper dropdown no longer uses noun-compatible pool");
}
if (!html.includes('const autoList=autoCompatibleSentenceWrappers();')) {
  failed = true;
  console.error("automatic wrapper path does not use role-gated pool");
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
if (!html.includes("return uniqueByReading([...standardSeamPool(),...bridgePool()])")) {
  failed = true;
  console.error("seamPool() does not merge standardSeamPool() and bridgePool()");
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

const growthGate = JSON.parse(fs.readFileSync("data/growth-wrapper-role-gate-v72.json", "utf8"));
const growthRollout = JSON.parse(fs.readFileSync("data/growth-wrapper-role-public-v74.json", "utf8"));
if (growthGate.version !== "0.72") {
  failed = true;
  console.error("Unexpected growth wrapper role gate version: " + growthGate.version);
}
if (growthRollout.version !== "0.74" || growthRollout.decision !== "approve-auto-selection-only") {
  failed = true;
  console.error("Unexpected growth wrapper public rollout: " + growthRollout.version + " / " + growthRollout.decision);
}
if (growthRollout.public_scope?.manual_wrapper_selection !== false) {
  failed = true;
  console.error("growth wrapper rollout must not restrict manual wrapper selection");
}

if (failed) process.exit(1);
console.log("UI validation OK.");
