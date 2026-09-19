import fs from "node:fs";

const corpus = JSON.parse(fs.readFileSync("data/layered-seeds-v08.json", "utf8"));
const rules = JSON.parse(fs.readFileSync("data/generation-rules-v08.json", "utf8"));
const pairs = JSON.parse(fs.readFileSync("data/reverse-lexeme-pairs-v09.json", "utf8"));
const growth = JSON.parse(fs.readFileSync("data/growth-engine-v10.json", "utf8"));
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
    for(const w of rule.wrappers)for(const inner of levels[d-1]){
      if(rule.constraints?.no_same_adjacent_relation && w.reading===inner.edge)continue;
      cur.push({reading:w.reading+"の"+inner.reading+"の"+w.reading,display:w.display+"の"+inner.display+"の"+w.display,depth:d,edge:w.reading});
    }
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
let pairVariants=0;
for(const p of pairs.pairs){
  if(reverse(p.left.reading)!==p.right.reading)errors.push(`PAIR reverse mismatch: ${p.id} / ${p.left.reading} / ${p.right.reading}`);
  for(const v of p.variants??[]){
    if([...v.particle].length!==1)errors.push(`PAIR particle is not one kana: ${p.id} / ${v.particle}`);
    check({id:"PAIR:"+p.id},p.left.display+v.particle+(v.right_display||p.right.display)+"。",p.left.reading+v.particle+p.right.reading);
    pairVariants++;
  }
}
if(pairs.pair_count!==pairs.pairs.length)errors.push(`PAIR COUNT mismatch: declared=${pairs.pair_count} actual=${pairs.pairs.length}`);
if(pairs.variant_count!==pairVariants)errors.push(`PAIR VARIANT COUNT mismatch: declared=${pairs.variant_count} actual=${pairVariants}`);

let growthVariants=0;
for(const f of growth.families){
  if(reverse(f.left[0])!==f.right[0])errors.push(`GROWTH reverse mismatch: ${f.id}`);
  check({id:"GROW:"+f.id},f.stage0[1],f.stage0[0]);
  let previousMin=[...f.stage0[0]].length;
  for(let stage=1;stage<=4;stage++){
    const list=growth.centers["stage"+stage]??[];
    let minLen=Infinity;
    for(const c of list){
      check({id:"GROW:"+f.id},f.left[1]+"も"+c[1]+"も"+f.right[1]+"。",f.left[0]+"も"+c[0]+"も"+f.right[0]);
      minLen=Math.min(minLen,[...(f.left[0]+"も"+c[0]+"も"+f.right[0])].length);
      growthVariants++;
    }
    if(minLen<=previousMin)errors.push(`GROWTH stage does not increase length: ${f.id} stage=${stage} min=${minLen} prev=${previousMin}`);
    previousMin=minLen;
  }
}
if(growth.verified?.generated_growth_variants!==growthVariants)errors.push(`GROWTH COUNT mismatch: declared=${growth.verified?.generated_growth_variants} actual=${growthVariants}`);

let narrativeVariants=0;
const narrativeByLayer={};
const narrativeByDimension={};
for(const f of growth.narrative_families??[]){
  if(!["L1","L2","L3"].includes(f.layer))errors.push(`NARRATIVE invalid/missing layer: ${f.id} / ${f.layer}`);
  if(!f.dimension)errors.push(`NARRATIVE missing dimension: ${f.id}`);
  narrativeByLayer[f.layer]=(narrativeByLayer[f.layer]??0)+1;
  narrativeByDimension[f.dimension]=(narrativeByDimension[f.dimension]??0)+1;
  let previousLength=-1;
  for(let stage=0;stage<f.stages.length;stage++){
    const st=f.stages[stage];
    check({id:"NARRATIVE:"+f.id},st.display,st.reading);
    if(!st.display)errors.push(`NARRATIVE missing display: ${f.id} stage=${stage}`);
    if(!st.adds)errors.push(`NARRATIVE missing adds metadata: ${f.id} stage=${stage}`);
    if(!st.japanese_quality)errors.push(`NARRATIVE missing japanese_quality: ${f.id} stage=${stage}`);
    if(!Number.isInteger(st.weirdness)||st.weirdness<1||st.weirdness>5)errors.push(`NARRATIVE invalid weirdness: ${f.id} stage=${stage} value=${st.weirdness}`);
    const len=[...st.reading].length;
    if(len<=previousLength)errors.push(`NARRATIVE stage does not increase length: ${f.id} stage=${stage} len=${len} prev=${previousLength}`);
    previousLength=len;
    narrativeVariants++;
  }
}
if(growth.verified?.narrative_family_count!=null && growth.verified.narrative_family_count!==(growth.narrative_families??[]).length)errors.push(`NARRATIVE FAMILY COUNT mismatch: declared=${growth.verified.narrative_family_count} actual=${(growth.narrative_families??[]).length}`);
if(growth.verified?.narrative_variants!=null && growth.verified.narrative_variants!==narrativeVariants)errors.push(`NARRATIVE COUNT mismatch: declared=${growth.verified.narrative_variants} actual=${narrativeVariants}`);
for(const [k,v] of Object.entries(growth.verified?.narrative_families_by_layer??{}))if((narrativeByLayer[k]??0)!==v)errors.push(`NARRATIVE LAYER COUNT mismatch ${k}: declared=${v} actual=${narrativeByLayer[k]??0}`);
for(const [k,v] of Object.entries(growth.verified?.narrative_families_by_dimension??{}))if((narrativeByDimension[k]??0)!==v)errors.push(`NARRATIVE DIMENSION COUNT mismatch ${k}: declared=${v} actual=${narrativeByDimension[k]??0}`);

let sentenceWrapperCount=0;
const wrapperProbe="つまがまつ";
const wrapperMap=new Map();
for(const w of growth.sentence_level_wrappers??[]){
  if(wrapperMap.has(w.id))errors.push(`SENTENCE WRAPPER duplicate id: ${w.id}`);
  wrapperMap.set(w.id,w);
  if(reverse(w.left_reading)!==w.right_reading)errors.push(`SENTENCE WRAPPER reverse mismatch: ${w.id}`);
  const wrapped=w.left_reading+wrapperProbe+w.right_reading;
  check({id:"SENTENCE-WRAPPER:"+w.id},w.semantic,wrapped);
  if(!w.left_display||!w.right_display||!w.semantic)errors.push(`SENTENCE WRAPPER metadata missing: ${w.id}`);
  if(!Array.isArray(w.outer_lexemes)||!w.outer_lexemes.length)errors.push(`SENTENCE WRAPPER outer_lexemes missing: ${w.id}`);
  for(const lex of w.outer_lexemes??[]){
    if(!lex.reading||!lex.display)errors.push(`SENTENCE WRAPPER bad outer lexeme: ${w.id}`);
    const combinedReading=w.left_reading+w.right_reading;
    const combinedDisplay=w.left_display+w.right_display;
    if(lex.reading&&!combinedReading.includes(lex.reading))errors.push(`SENTENCE WRAPPER lexeme reading not in wrapper: ${w.id} / ${lex.reading}`);
    if(lex.display&&!combinedDisplay.includes(lex.display))errors.push(`SENTENCE WRAPPER lexeme display not in wrapper: ${w.id} / ${lex.display}`);
  }
  sentenceWrapperCount++;
}
if(growth.verified?.sentence_level_wrapper_count!=null&&growth.verified.sentence_level_wrapper_count!==sentenceWrapperCount)errors.push(`SENTENCE WRAPPER COUNT mismatch: declared=${growth.verified.sentence_level_wrapper_count} actual=${sentenceWrapperCount}`);
const distinctOuterReadings=new Set((growth.sentence_level_wrappers??[]).flatMap(w=>(w.outer_lexemes??[]).map(x=>x.reading))).size;
if(growth.verified?.wrapper_distinct_outer_readings!=null&&growth.verified.wrapper_distinct_outer_readings!==distinctOuterReadings)errors.push(`WRAPPER DISTINCT OUTER mismatch: declared=${growth.verified.wrapper_distinct_outer_readings} actual=${distinctOuterReadings}`);

let quoteCollisionCount=0;
for(const f of growth.narrative_families??[]){
  for(let stage=1;stage<f.stages.length;stage++){
    const st=f.stages[stage];
    if(!st.wrapper_id)continue;
    const prev=f.stages[stage-1];
    const w=wrapperMap.get(st.wrapper_id);
    if(!w){errors.push(`QUOTE wrapper id missing: ${f.id} stage=${stage} id=${st.wrapper_id}`);continue}
    const expected=w.left_reading+prev.reading+w.right_reading;
    if(st.reading!==expected)errors.push(`QUOTE wrapper chain mismatch: ${f.id} stage=${stage}`);
    for(const lex of w.outer_lexemes??[]){
      const hitDisplay=lex.display&&prev.display.includes(lex.display);
      const hitReading=lex.reading&&prev.reading.includes(lex.reading);
      if(hitDisplay||hitReading){
        quoteCollisionCount++;
        errors.push(`QUOTE noun collision: ${f.id} stage=${stage} wrapper=${w.id} lexeme=${lex.display}`);
      }
    }
  }
}
if(growth.verified?.noun_collision_policy===true&&quoteCollisionCount!==0)errors.push(`QUOTE noun collision policy failed: ${quoteCollisionCount}`);

const fixedQuoteFamilies=(growth.narrative_families??[]).filter(f=>f.id.startsWith("quote-"));
const firstWrapperIds=fixedQuoteFamilies.map(f=>f.stages?.[1]?.wrapper_id).filter(Boolean);
const firstWrapperDiversity=new Set(firstWrapperIds).size;
if(growth.verified?.fixed_quote_family_count!=null&&growth.verified.fixed_quote_family_count!==fixedQuoteFamilies.length)errors.push(`FIXED QUOTE FAMILY COUNT mismatch: declared=${growth.verified.fixed_quote_family_count} actual=${fixedQuoteFamilies.length}`);
if(growth.verified?.fixed_quote_first_wrapper_diversity!=null&&growth.verified.fixed_quote_first_wrapper_diversity!==firstWrapperDiversity)errors.push(`FIRST WRAPPER DIVERSITY mismatch: declared=${growth.verified.fixed_quote_first_wrapper_diversity} actual=${firstWrapperDiversity}`);

const hundred=growth.verified?.hundred_kana_benchmark;
if(hundred){
  const bf=(growth.narrative_families??[]).find(f=>f.id===hundred.family);
  const bs=bf?.stages?.[hundred.stage];
  if(!bs)errors.push(`100-KANA benchmark stage missing: ${hundred.family} stage=${hundred.stage}`);
  else{
    const actual=[...bs.reading].length;
    if(!isPalindrome(bs.reading))errors.push(`100-KANA benchmark is not palindrome`);
    if(actual!==hundred.length)errors.push(`100-KANA benchmark length mismatch: declared=${hundred.length} actual=${actual}`);
    if(actual<(hundred.min_required??100))errors.push(`100-KANA benchmark too short: ${actual}`);
    if(hundred.noun_collision_free&&quoteCollisionCount!==0)errors.push(`100-KANA benchmark noun collision policy failed`);
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
console.log(`Reverse lexeme pairs: ${pairs.pair_count}, variants: ${pairVariants}`);
console.log(`Stepwise growth variants: ${growthVariants}`);
console.log(`Narrative growth variants: ${narrativeVariants}`);
console.log(`Sentence-level wrappers: ${sentenceWrapperCount}`);
