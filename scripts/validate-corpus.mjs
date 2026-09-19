import fs from "node:fs";

const corpus = JSON.parse(fs.readFileSync("data/layered-seeds-v08.json", "utf8"));
const rules = JSON.parse(fs.readFileSync("data/generation-rules-v08.json", "utf8"));
const pairs = JSON.parse(fs.readFileSync("data/reverse-lexeme-pairs-v09.json", "utf8"));
const growth = JSON.parse(fs.readFileSync("data/growth-engine-v10.json", "utf8"));
const seams = JSON.parse(fs.readFileSync("data/seam-grammar-v25.json", "utf8"));
const historical = JSON.parse(fs.readFileSync("data/historical-kaibunka-samples-v27.json", "utf8"));
const historicalMining = JSON.parse(fs.readFileSync("data/historical-kaibunka-mining-v28.json", "utf8"));
const tankaLattice = JSON.parse(fs.readFileSync("data/tanka-mirror-lattice-v28.json", "utf8"));
const semanticFields = JSON.parse(fs.readFileSync("data/historical-semantic-fields-v32.json", "utf8"));
const edgePairs = JSON.parse(fs.readFileSync("data/historical-edge-pairs-v33.json", "utf8"));
const fiveVar = JSON.parse(fs.readFileSync("data/tanka-five-variable-grammar-v34.json", "utf8"));
const factorHybrids = JSON.parse(fs.readFileSync("data/historical-factor-hybrids-v35.json", "utf8"));
const seamSignatures = JSON.parse(fs.readFileSync("data/historical-seam-signatures-v36.json", "utf8"));
const hybridReview = JSON.parse(fs.readFileSync("data/historical-hybrid-review-v37.json", "utf8"));
const cento = JSON.parse(fs.readFileSync("data/historical-cento-candidates-v38.json", "utf8"));
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

let seamRecipeCount=0;
for(const r of seams.recipes??[]){
  check({id:"SEAM:"+r.id},r.display,r.reading);
  if(!["L1","L2","L3"].includes(r.layer))errors.push(`SEAM invalid layer: ${r.id} / ${r.layer}`);
  if(!Number.isInteger(r.boundary_shift_shells)||r.boundary_shift_shells<0)errors.push(`SEAM invalid boundary_shift_shells: ${r.id}`);
  if(!Number.isInteger(r.particle_hinges)||r.particle_hinges<0)errors.push(`SEAM invalid particle_hinges: ${r.id}`);
  seamRecipeCount++;
}
if(seams.verified?.recipe_count!=null&&seams.verified.recipe_count!==seamRecipeCount)errors.push(`SEAM COUNT mismatch: declared=${seams.verified.recipe_count} actual=${seamRecipeCount}`);
for(const sh of seams.shells??[]){
  if(reverse(sh.left.reading)!==sh.right.reading)errors.push(`SEAM shell reverse mismatch: ${sh.id}`);
}
for(const c of seams.cores??[]){
  if(!isPalindrome(c.reading))errors.push(`SEAM core not palindrome: ${c.id}`);
}
for(const ref of seams.reference_specimens??[]){
  if(ref.strict_palindrome_under_normalization&&!isPalindrome(ref.normalized_reading))errors.push(`SEAM reference not palindrome: ${ref.id}`);
}

let historicalCount=0;
for(const h of historical.samples??[]){
  if(!h.normalized_reading||!isPalindrome(h.normalized_reading))errors.push(`HISTORICAL sample not palindrome after declared normalization: ${h.id}`);
  if(h.kana_length!==[...h.normalized_reading].length)errors.push(`HISTORICAL length mismatch: ${h.id}`);
  if(!Array.isArray(h.normalization)||!h.normalization.length)errors.push(`HISTORICAL normalization metadata missing: ${h.id}`);
  if(!Array.isArray(h.learning_tags)||!h.learning_tags.length)errors.push(`HISTORICAL learning tags missing: ${h.id}`);
  if(!h.source_confidence)errors.push(`HISTORICAL source confidence missing: ${h.id}`);
  historicalCount++;
}
if(historical.sample_count!==historicalCount)errors.push(`HISTORICAL COUNT mismatch: declared=${historical.sample_count} actual=${historicalCount}`);
if(historical.all_normalized_palindromes!==true)errors.push("HISTORICAL corpus is not declared fully verified");

let miningCount=0;
let miningThirdKuPal=0;
for(const h of historicalMining.candidates??[]){
  const reading=h.source_transcription_normalized;
  if(!reading||!isPalindrome(reading))errors.push(`MINING sample not palindrome: ${h.id}`);
  if([...(reading||"")].length!==31)errors.push(`MINING sample not 31 kana: ${h.id}`);
  if((h.meter_segments??[]).join("")!==reading)errors.push(`MINING meter segments mismatch: ${h.id}`);
  if((h.meter_segments??[]).map(x=>[...x].length).join(",")!=="5,7,5,7,7")errors.push(`MINING meter mismatch: ${h.id}`);
  if(h.meter_segments?.[2]&&isPalindrome(h.meter_segments[2]))miningThirdKuPal++;
  miningCount++;
}
if(historicalMining.candidates?.length!==miningCount)errors.push(`MINING COUNT mismatch`);

const expectedMeter=[5,12,17,24];
const expectedReflected=[26,19,14,7];
const expectedCombined=[5,7,12,14,17,19,24,26];
const expectedCells=[5,2,5,2,3,2,5,2,5];
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
if(tankaLattice.total_kana!==31)errors.push("LATTICE total_kana must be 31");
if(!eq(tankaLattice.meter_boundaries,expectedMeter))errors.push("LATTICE meter boundaries mismatch");
if(!eq(tankaLattice.reflected_meter_boundaries,expectedReflected))errors.push("LATTICE reflected boundaries mismatch");
if(!eq(tankaLattice.combined_boundaries,expectedCombined))errors.push("LATTICE combined boundaries mismatch");
if(!eq(tankaLattice.symmetric_cells,expectedCells))errors.push("LATTICE cells mismatch");
if(tankaLattice.center_position_1_based!==16)errors.push("LATTICE center mismatch");

const allHistorical=[...(historical.samples??[]),...(historicalMining.candidates??[])];
let thirdKuPalCount=0;
for(const x of allHistorical){
  const reading=x.normalized_reading||x.source_transcription_normalized;
  if(!reading||[...reading].length!==31)continue;
  const a=[...reading];
  const ku3=a.slice(12,17).join("");
  if(isPalindrome(ku3))thirdKuPalCount++;
}
const empirical=tankaLattice.empirical_check;
if(empirical){
  if(empirical.sample_count!==allHistorical.length)errors.push(`LATTICE empirical sample count mismatch: declared=${empirical.sample_count} actual=${allHistorical.length}`);
  if(empirical.third_ku_palindrome_count!==thirdKuPalCount)errors.push(`LATTICE third-ku count mismatch: declared=${empirical.third_ku_palindrome_count} actual=${thirdKuPalCount}`);
}

const historicalIds=new Set(allHistorical.map(x=>x.id));
if(semanticFields.sample_count!==allHistorical.length)errors.push(`SEMANTIC FIELD sample count mismatch: declared=${semanticFields.sample_count} actual=${allHistorical.length}`);
if((semanticFields.entries??[]).length!==allHistorical.length)errors.push(`SEMANTIC FIELD entry count mismatch`);
for(const e of semanticFields.entries??[]){
  if(!historicalIds.has(e.id))errors.push(`SEMANTIC FIELD unknown id: ${e.id}`);
  if(!e.broad_field||!e.primary_field)errors.push(`SEMANTIC FIELD missing classification: ${e.id}`);
}

let edgePairRows=0;
for(const p of edgePairs.pairs??[]){
  if(reverse(p.left2)!==p.right2)errors.push(`EDGE PAIR reverse mismatch: ${p.left2}/${p.right2}`);
  edgePairRows+=p.count??0;
}
if(edgePairs.sample_count!==allHistorical.length)errors.push(`EDGE PAIR sample count mismatch`);
if(edgePairRows!==allHistorical.length)errors.push(`EDGE PAIR frequency total mismatch: ${edgePairRows}/${allHistorical.length}`);
if(edgePairs.verified_reverse_relation!==true)errors.push("EDGE PAIR verification flag false");

function splitFiveVariable(reading){
  const a=[...reading];
  return {A:a.slice(0,5).join(""),B:a.slice(5,7).join(""),C:a.slice(7,12).join(""),D:a.slice(12,14).join(""),E:a.slice(14,17).join(""),Dr:a.slice(17,19).join(""),Cr:a.slice(19,24).join(""),Br:a.slice(24,26).join(""),Ar:a.slice(26,31).join("")};
}
if(fiveVar.sample_count!==allHistorical.length)errors.push(`FIVEVAR sample count mismatch`);
for(const s of fiveVar.samples??[]){
  const source=allHistorical.find(x=>x.id===s.id);
  if(!source){errors.push(`FIVEVAR unknown source: ${s.id}`);continue}
  const reading=source.normalized_reading||source.source_transcription_normalized;
  const c=splitFiveVariable(reading);
  for(const k of ["A","B","C","D","E"])if(c[k]!==s[k])errors.push(`FIVEVAR component mismatch: ${s.id} ${k}`);
  if(c.Dr!==reverse(c.D)||c.Cr!==reverse(c.C)||c.Br!==reverse(c.B)||c.Ar!==reverse(c.A)||c.E!==reverse(c.E))errors.push(`FIVEVAR algebra mismatch: ${s.id}`);
}

for(const [kind,table] of Object.entries({B2:seamSignatures.B2??{},D2:seamSignatures.D2??{}})){
  for(const [reading,sig] of Object.entries(table)){
    for(const id of sig.evidence??[])if(!historicalIds.has(id))errors.push(`SEAM SIGNATURE unknown evidence: ${kind} ${reading} ${id}`);
  }
}

if(factorHybrids.novel_path_count!==(factorHybrids.candidates??[]).length)errors.push("FACTOR HYBRID count mismatch");
for(const c of factorHybrids.candidates??[]){
  if([...(c.reading??"")].length!==31||!isPalindrome(c.reading))errors.push(`FACTOR HYBRID invalid palindrome: ${c.id}`);
  if(c.local_factor_attested!==true)errors.push(`FACTOR HYBRID not attested flag: ${c.id}`);
}
if(factorHybrids.all_palindrome_verified!==true)errors.push("FACTOR HYBRID verification flag false");

if(hybridReview.total!==(hybridReview.candidates??[]).length)errors.push("HYBRID REVIEW count mismatch");
if(hybridReview.total!==(factorHybrids.candidates??[]).length)errors.push("HYBRID REVIEW/source count mismatch");
for(const c of hybridReview.candidates??[])if(!c.research_status)errors.push(`HYBRID REVIEW missing status: ${c.id}`);

if(cento.total!==(cento.candidates??[]).length)errors.push("CENTO count mismatch");
for(const c of cento.candidates??[]){
  if(!isPalindrome(c.reading)||[...c.reading].length!==31)errors.push(`CENTO invalid palindrome: ${c.id}`);
  for(const kp of Object.values(c.ku_provenance??{})){
    if(!kp.reading||!(kp.source_ids??[]).length)errors.push(`CENTO missing ku provenance: ${c.id}`);
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
console.log(`Seam-shift recipes: ${seamRecipeCount}`);
console.log(`Historical kaibunka samples: ${historicalCount}`);
console.log(`Historical mining samples: ${miningCount}`);
console.log(`Tanka lattice third-ku palindromes: ${thirdKuPalCount}/${allHistorical.length}`);
console.log(`Research semantic fields: ${semanticFields.sample_count}`);
console.log(`Historical factor hybrids: ${factorHybrids.novel_path_count}`);
console.log(`Historical cento candidates: ${cento.total}`);
