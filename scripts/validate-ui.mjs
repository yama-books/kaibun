import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const mobileProtocol = JSON.parse(fs.readFileSync("data/public-mobile-device-check-v131.json", "utf8"));
const releasePath = JSON.parse(fs.readFileSync("data/public-release-ui-path-v132.json", "utf8"));

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
  "./data/growth-wrapper-role-public-v74.json",
  "./data/public-reading-hints-v82.json",
  "./data/dna-kinship-exposure-policy-v84.json",
  "./data/ten-comparison-balance-policy-v86.json",
  "./data/l2-ten-comparison-policy-v93.json",
  "./data/growth-selector-usability-policy-v95.json"
];
for (const id of ["lengthMeta","wrapMeta","readingHintMeta"]) {
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

for (const fn of ["activeReadingHints","syncReadingHint"]) {
  if (!html.includes("function " + fn + "(")) {
    failed = true;
    console.error("index.html is missing reading hint function: " + fn);
  }
}
if (!html.includes('syncReadingHint(x);')) {
  failed = true;
  console.error("show() does not synchronize reading hints");
}

if (!html.includes("recursive_probability_cap")) {
  failed = true;
  console.error("index.html does not apply DNA kinship exposure policy");
}
if (!html.includes("const recursiveReadings=new Set(recursivePool().map(x=>x.reading));")) {
  failed = true;
  console.error("dnaOne() does not classify recursive readings via recursivePool()");
}

for (const fn of ["tenComparisonItems","takeRandomUnused","shuffleItems"]) {
  if (!html.includes("function " + fn + "(")) {
    failed = true;
    console.error("index.html is missing ten-comparison helper: " + fn);
  }
}
if (!html.includes('const items=tenComparisonItems();')) {
  failed = true;
  console.error("ten-item comparison handler does not use balanced selector");
}

if (!html.includes("function repairL2Comparison(")) {
  failed = true;
  console.error("index.html is missing L2 comparison repair helper");
}
if (!html.includes('if(layer==="L2")')) {
  failed = true;
  console.error("tenComparisonItems() does not branch for L2");
}

for (const fn of ["compactGrowthFamilyLabel","appendGrowthFamilyOption"]) {
  if (!html.includes("function " + fn + "(")) {
    failed = true;
    console.error("index.html is missing growth selector helper: " + fn);
  }
}
if (!html.includes('document.createElement("optgroup")')) {
  failed = true;
  console.error("growth family selector does not group all-dimension options");
}
if (!html.includes('all.textContent="すべて ("+families.length+")"')) {
  failed = true;
  console.error("growth dimension selector does not expose family count");
}
if (!html.includes('return label+" · "+(f.stages?.length||1)+"段";')) {
  failed = true;
  console.error("growth family labels do not expose stage count");
}
if (html.includes('function growAgain(){\n  if(layer!=="L1")return;')) {
  failed = true;
  console.error("growAgain() still blocks all L2 narrative rerolls");
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

const readingHints = JSON.parse(fs.readFileSync("data/public-reading-hints-v82.json", "utf8"));
if (readingHints.version !== "0.82") {
  failed = true;
  console.error("Unexpected public reading hints version: " + readingHints.version);
}
if ((readingHints.lexemes ?? []).length !== 2) {
  failed = true;
  console.error("Unexpected public reading hint lexeme count: " + (readingHints.lexemes ?? []).length);
}

const dnaExposure = JSON.parse(fs.readFileSync("data/dna-kinship-exposure-policy-v84.json", "utf8"));
if (dnaExposure.version !== "0.84") {
  failed = true;
  console.error("Unexpected DNA kinship exposure policy version: " + dnaExposure.version);
}
if (dnaExposure.policy?.recursive_probability_cap !== 0.25) {
  failed = true;
  console.error("Unexpected DNA kinship exposure cap: " + dnaExposure.policy?.recursive_probability_cap);
}

const tenBalance = JSON.parse(fs.readFileSync("data/ten-comparison-balance-policy-v86.json", "utf8"));
if (tenBalance.version !== "0.86.1") {
  failed = true;
  console.error("Unexpected ten-item comparison policy version: " + tenBalance.version);
}
if ((tenBalance.quotas ?? []).reduce((n,q)=>n+(q.count??0),0) !== 10) {
  failed = true;
  console.error("Ten-item comparison quota total is not 10");
}

const l2Ten = JSON.parse(fs.readFileSync("data/l2-ten-comparison-policy-v93.json", "utf8"));
if (l2Ten.version !== "0.93") {
  failed = true;
  console.error("Unexpected L2 comparison policy version: " + l2Ten.version);
}
if (l2Ten.rule?.capped_family !== "同定" || l2Ten.rule?.max_items !== 2) {
  failed = true;
  console.error("Unexpected L2 comparison cap configuration");
}

const growthSelector = JSON.parse(fs.readFileSync("data/growth-selector-usability-policy-v95.json", "utf8"));
if (growthSelector.version !== "0.95") {
  failed = true;
  console.error("Unexpected growth selector policy version: " + growthSelector.version);
}
const growthData = JSON.parse(fs.readFileSync("data/growth-engine-v10.json", "utf8"));
if ((growthData.narrative_families ?? []).length !== 53) {
  failed = true;
  console.error("Growth selector rollout changed narrative family count");
}
if ((growthData.narrative_families ?? []).reduce((n,f)=>n+(f.stages??[]).length,0) !== 366) {
  failed = true;
  console.error("Growth selector rollout changed narrative stage count");
}


if (mobileProtocol.version !== "1.31" || mobileProtocol.public_ui_version !== "0.35") {
  failed = true;
  console.error("Unexpected mobile device protocol version/UI version");
}
if (!html.includes('content="width=device-width,initial-scale=1,viewport-fit=cover"')) {
  failed = true;
  console.error("mobile viewport-fit=cover missing");
}
if (!html.includes('v0.35 / 公開導線整理')) {
  failed = true;
  console.error("public UI badge is not v0.35");
}
for (const id of ["deviceDebug","deviceDebugStatus","deviceViewport","deviceVisualViewport","deviceTouch","deviceSafeArea","deviceData","deviceStorage","deviceTargets","deviceOverflow","deviceCurrent","deviceDpr","deviceDebugRefresh","deviceDebugCopy"]) {
  if (!html.includes('id="' + id + '"')) {
    failed = true;
    console.error("mobile diagnostic element missing: " + id);
  }
}
for (const fn of ["mobileDebugSnapshot","renderMobileDebug","setupMobileDebug"]) {
  if (!html.includes("function " + fn + "(")) {
    failed = true;
    console.error("mobile diagnostic function missing: " + fn);
  }
}
if (!html.includes('new URLSearchParams(location.search).get("debug")==="mobile"')) {
  failed = true;
  console.error("mobile diagnostic query gate missing");
}
if (!html.includes('min-height:44px')) {
  failed = true;
  console.error("44px mobile tap target rule missing");
}
if (!html.includes('env(safe-area-inset-bottom)')) {
  failed = true;
  console.error("safe-area mobile padding missing");
}
if (!html.includes('document.documentElement.scrollWidth>window.innerWidth+1')) {
  failed = true;
  console.error("horizontal overflow diagnostic missing");
}
if (!html.includes('mobileDebugDataLoaded=true;')) {
  failed = true;
  console.error("mobile diagnostic data-load completion flag missing");
}
if (mobileProtocol.mobile_css_contract?.tap_target_min_height_px !== 44 || mobileProtocol.mobile_css_contract?.horizontal_overflow_is_failure !== true) {
  failed = true;
  console.error("mobile CSS contract drift");
}
if ((mobileProtocol.manual_smoke_test ?? []).length !== 10) {
  failed = true;
  console.error("mobile manual smoke-test count must be 10");
}

if (releasePath.version !== "1.32" || releasePath.public_ui_version !== "0.35") {
  failed = true;
  console.error("Unexpected public release UI path version");
}
for (const id of ["stepChoose","stepGenerate","stepGrow"]) {
  if (!html.includes('id="' + id + '"')) {
    failed = true;
    console.error("public release step missing: " + id);
  }
}
for (const label of ["雰囲気を選ぶ","回文を作る","気に入ったら長くする","回文を1本つくる","別の回文をつくる","作り方を選ぶ","仕組み・検証情報"]) {
  if (!html.includes(label)) {
    failed = true;
    console.error("public release label missing: " + label);
  }
}
if (!html.includes('<button id="pairGen">逆語ペアで作る</button>') || !html.includes('<button id="seamGen">継ぎ目型で作る</button>')) {
  failed = true;
  console.error("advanced generation buttons missing from foldout");
}
if (!html.includes('class="card techCard"') || !html.includes('<summary>仕組み・検証情報</summary>')) {
  failed = true;
  console.error("technical route is not folded out");
}
if (!html.includes("怪文回文メーカー v0.35 実機診断")) {
  failed = true;
  console.error("mobile diagnostic copy text is not v0.35");
}
const idMatches=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
const duplicateIds=idMatches.filter((id,i)=>idMatches.indexOf(id)!==i);
if (duplicateIds.length) {
  failed = true;
  console.error("duplicate public UI ids: " + [...new Set(duplicateIds)].join(","));
}
if (failed) process.exit(1);
console.log("UI validation OK.");
