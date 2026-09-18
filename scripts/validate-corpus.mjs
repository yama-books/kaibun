import fs from "node:fs";

const corpus = JSON.parse(fs.readFileSync("data/layered-seeds-v08.json", "utf8"));
const rules = JSON.parse(fs.readFileSync("data/generation-rules-v08.json", "utf8"));
const reverse=s=>[...s].reverse().join("");
const isPalindrome=s=>s===reverse(s);
const errors=[];

for(const r of corpus.records){
  if(!r.reading||!isPalindrome(r.reading))errors.push(`CORPUS non-palindrome: ${r.id??"?"} ${r.display??""} / ${r.reading??""}`);
  if(r.layer==="L1"&&String(r.subgroup??"").includes("telegraphic"))errors.push(`L1 contains telegraphic item: ${r.id} ${r.display}`);
  if(!["L1","L2","L3"].includes(r.layer))errors.push(`Unknown layer: ${r.id} ${r.layer}`);
}
function check(rule,display,reading){if(!reading||!isPalindrome(reading))errors.push(`RULE non-palindrome: ${rule.id} / ${display??""} / ${reading??""}`)}
function recursiveNPs(rule){
  const levels=[rule.bases.map(x=>({...x,depth:0}))];
  for(let d=1;d<=rule.max_depth;d++){
    const cur=[];
    for(const w of rule.wrappers)for(const inner of levels[d-1])cur.push({reading:w.reading+"の"+inner.reading+"の"+w.reading,display:w.display+"の"+inner.display+"の"+w.display,depth:d});
    levels.push(cur);
  }
  return levels.flat();
}
let recursiveSentenceCount=0;
for(const rule of rules.rules){
  if(rule.type==="fixed"){check(rule,rule.display,rule.reading);continue}
  if(rule.type==="particle_pair"){for(const v of rule.variants??[])check(rule,v[1],rule.left+v[0]+rule.right);continue}
  if(rule.type==="mirrored_coordination"){for(const v of rule.variants??[])check(rule,v[1],rule.reading_pattern.replace("{person}",v[0]));continue}
  if(rule.type==="recursive_kinship"){
    const nps=recursiveNPs(rule);
    for(const np of nps){
      check(rule,np.display,np.reading);
      for(const f of rule.frames){check(rule,f.display.replace("{np}",np.display),f.left+np.reading+f.right);recursiveSentenceCount++}
    }
    continue;
  }
  for(const v of rule.variants??[]){
    let reading=rule.reading_pattern??"";
    if(reading.includes("{c}"))reading=reading.replace("{c}",v[0]);
    if(reading.includes("{pal_center}"))reading=reading.replace("{pal_center}",v[0]);
    check(rule,v[1],reading);
  }
}
const counts=corpus.records.reduce((a,r)=>(a[r.layer]=(a[r.layer]??0)+1,a),{});
for(const l of ["L1","L2","L3"])if(counts[l]!==corpus.counts[l])errors.push(`COUNT mismatch ${l}: declared=${corpus.counts[l]} actual=${counts[l]}`);
if(rules.rule_count!==rules.rules.length)errors.push(`RULE COUNT mismatch: declared=${rules.rule_count} actual=${rules.rules.length}`);
if(rules.verified_recursive_space && recursiveSentenceCount!==rules.verified_recursive_space.sentence_variants)errors.push(`RECURSIVE COUNT mismatch: declared=${rules.verified_recursive_space.sentence_variants} actual=${recursiveSentenceCount}`);

if(errors.length){console.error("\nValidation failed:\n"+errors.map(x=>"- "+x).join("\n"));process.exit(1)}
console.log(`OK: ${corpus.records.length} corpus records, ${rules.rules.length} DNA rules.`);
console.log(`Layers: L1=${counts.L1}, L2=${counts.L2}, L3=${counts.L3}`);
console.log(`Recursive sentence space: ${recursiveSentenceCount}`);
