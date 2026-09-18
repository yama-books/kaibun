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
  "./data/growth-engine-v10.json"
];
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

if (failed) process.exit(1);
console.log("UI validation OK.");
