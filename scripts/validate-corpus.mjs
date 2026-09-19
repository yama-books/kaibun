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
const wave2 = JSON.parse(fs.readFileSync("data/historical-mining-wave2-v39.json", "utf8"));
const hybridCuration = JSON.parse(fs.readFileSync("data/historical-hybrid-curation-v40.json", "utf8"));
const yamauchiTokenization = JSON.parse(fs.readFileSync("data/yamauchi-tokenization-model-v41.json", "utf8"));
const topicFirst = JSON.parse(fs.readFileSync("data/historical-topic-first-model-v42.json", "utf8"));
const wave2Triage = JSON.parse(fs.readFileSync("data/historical-wave2-source-triage-v43.json", "utf8"));
const autumnMoonSpans = JSON.parse(fs.readFileSync("data/autumn-moon-variable-spans-v44.json", "utf8"));
const topicFirstGate = JSON.parse(fs.readFileSync("data/historical-topic-first-gate-v45.json", "utf8"));
const autumnMoonMicrogrammar = JSON.parse(fs.readFileSync("data/autumn-moon-microgrammar-v46.json", "utf8"));
const autumnMoonControl = JSON.parse(fs.readFileSync("data/autumn-moon-control-microgrammar-v47.json", "utf8"));
const sceneGate = JSON.parse(fs.readFileSync("data/scene-compatibility-gate-v48.json", "utf8"));
const factorSceneSignatures = JSON.parse(fs.readFileSync("data/autumn-moon-factor-scene-signatures-v49.json", "utf8"));
const seamReviewQueue = JSON.parse(fs.readFileSync("data/autumn-moon-seam-review-queue-v50.json", "utf8"));
const seamEvidence = JSON.parse(fs.readFileSync("data/autumn-moon-seam-evidence-v51.json", "utf8"));
const sourceSpecificLane = JSON.parse(fs.readFileSync("data/source-specific-seam-review-lane-v52.json", "utf8"));
const haniPivotExchange = JSON.parse(fs.readFileSync("data/hani-central-pivot-exchange-v53.json", "utf8"));
const pivotSurvey = JSON.parse(fs.readFileSync("data/central-pivot-exchange-survey-v54.json", "utf8"));
const mitsuPivotExchange = JSON.parse(fs.readFileSync("data/mitsu-central-pivot-exchange-v55.json", "utf8"));
const semanticRoleGate = JSON.parse(fs.readFileSync("data/factor-semantic-role-gate-v56.json", "utf8"));
const pivotPipeline = JSON.parse(fs.readFileSync("data/central-pivot-candidate-pipeline-v57.json", "utf8"));
const generatorContract = JSON.parse(fs.readFileSync("data/historical-generator-contract-v58.json", "utf8"));
const hybrid002DeepReview = JSON.parse(fs.readFileSync("data/hybrid-002-deep-review-v99.json", "utf8"));
const pivotMorphologyGuard = JSON.parse(fs.readFileSync("data/central-pivot-morphology-guard-v100.json", "utf8"));
const generatedPivotV100 = JSON.parse(fs.readFileSync("data/generated-central-pivot-research-v100.json", "utf8"));
const shoju068SourceReview = JSON.parse(fs.readFileSync("data/shoju-068-source-review-v101.json", "utf8"));
const mataOuterReview = JSON.parse(fs.readFileSync("data/mata-outer-frame-morphology-review-v102.json", "utf8"));
const musuMoonFamily = JSON.parse(fs.readFileSync("data/musu-moon-family-review-v103.json", "utf8"));
const generatedMusuMoonV104 = JSON.parse(fs.readFileSync("data/generated-musu-moon-outer-frame-v104.json", "utf8"));
const hybrid007SyntaxV105 = JSON.parse(fs.readFileSync("data/hybrid-007-syntax-deep-review-v105.json", "utf8"));
const wave2TravelMahaV106 = JSON.parse(fs.readFileSync("data/wave2-travel-maha-outer-frame-prospect-v106.json", "utf8"));
const wave2RepeatedSeamV107 = JSON.parse(fs.readFileSync("data/wave2-repeated-seam-survey-v107.json", "utf8"));
const generatedWave2TravelV108 = JSON.parse(fs.readFileSync("data/generated-wave2-travel-outer-frame-v108.json", "utf8"));
const wave2TravelSyntaxV109 = JSON.parse(fs.readFileSync("data/wave2-travel-syntax-source-review-v109.json", "utf8"));
const fixed50OperationAuditV110 = JSON.parse(fs.readFileSync("data/fixed50-minimal-operation-audit-v110.json", "utf8"));
const wave2GraphAuditV111 = JSON.parse(fs.readFileSync("data/wave2-factor-graph-expansion-audit-v111.json", "utf8"));
const yamauchiVisibleV112 = JSON.parse(fs.readFileSync("data/yamauchi-visible-transcription-review-v112.json", "utf8"));
const wave2TravelDeepV113 = JSON.parse(fs.readFileSync("data/wave2-travel-deep-syntax-review-v113.json", "utf8"));
const generatedWave2TravelV114 = JSON.parse(fs.readFileSync("data/generated-wave2-travel-outer-frame-v114.json", "utf8"));
const wave2HeldPolicyV115 = JSON.parse(fs.readFileSync("data/wave2-held-evidence-policy-review-v115.json", "utf8"));
const orthographicEquivalenceV116 = JSON.parse(fs.readFileSync("data/historical-orthographic-equivalence-v116.json", "utf8"));
const travelSeriesTopologyV117 = JSON.parse(fs.readFileSync("data/travel-series-phrase-topology-v117.json", "utf8"));
const travelSeriesScholarlyV118 = JSON.parse(fs.readFileSync("data/travel-series-scholarly-topology-v118.json", "utf8"));
const historicalMiningWave3V119 = JSON.parse(fs.readFileSync("data/historical-mining-wave3-v119.json", "utf8"));
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

for(const x of wave2.verified_candidates??[]){
  if(!x.reading||[...x.reading].length!==31||!isPalindrome(x.reading))errors.push(`WAVE2 candidate invalid: ${x.id}`);
}
if(wave2.verified_count!==(wave2.verified_candidates??[]).length)errors.push("WAVE2 verified count mismatch");
if(wave2.held_count!==(wave2.held_for_source_image_review??[]).length)errors.push("WAVE2 held count mismatch");

const curatedIds=new Set((hybridCuration.reviews??[]).map(x=>x.id));
if(curatedIds.size!==(hybridCuration.reviews??[]).length)errors.push("HYBRID CURATION duplicate ids");
for(const x of hybridCuration.reviews??[]){
  if(!isPalindrome(x.reading)||[...x.reading].length!==31)errors.push(`HYBRID CURATION invalid palindrome: ${x.id}`);
  if(!factorHybrids.candidates?.some(y=>y.id===x.id))errors.push(`HYBRID CURATION unknown hybrid: ${x.id}`);
  if(!x.status||!x.action)errors.push(`HYBRID CURATION missing status/action: ${x.id}`);
}

if(!(yamauchiTokenization.interpretation_for_engine??[]).length)errors.push("YAMAUCHI TOKENIZATION principles missing");
if(!(yamauchiTokenization.unit_schema?.reading))errors.push("YAMAUCHI TOKENIZATION schema missing");
if(!(topicFirst.topic_hierarchy??[]).length)errors.push("TOPIC FIRST hierarchy missing");
if(topicFirst.source_findings?.local_50_sample_counts?.reduce((n,x)=>n+x[1],0)!==50)errors.push("TOPIC FIRST local counts must total 50");
if(wave2Triage.version!=="0.43")errors.push(`WAVE2 TRIAGE version mismatch: ${wave2Triage.version}`);
const triageNumbers=(wave2Triage.cases??[]).map(x=>x.source_number).sort((a,b)=>a-b);
if(triageNumbers.join(",")!=="82,88,89,92,94")errors.push(`WAVE2 TRIAGE case set mismatch: ${triageNumbers.join(",")}`);
const triage89=(wave2Triage.cases??[]).find(x=>x.source_number===89);
if(!triage89||triage89.strict_palindrome!==true||!isPalindrome(triage89.candidate_reading??""))errors.push("WAVE2 TRIAGE 89 candidate must remain an exact candidate palindrome");
if(wave2Triage.summary?.promoted_to_wave2_verified!==0)errors.push("WAVE2 TRIAGE must not promote source-image-unconfirmed records");
if(wave2.verified_count!==14||wave2.held_count!==5)errors.push("WAVE2 v39 baseline changed during v43 triage");
if(autumnMoonSpans.version!=="0.44")errors.push(`AUTUMN MOON V44 version mismatch: ${autumnMoonSpans.version}`);
if(autumnMoonSpans.scope?.baseline_sample_count!==50)errors.push("AUTUMN MOON V44 must preserve the 50-sample baseline");
if(autumnMoonSpans.scope?.topic_sample_count!==12||autumnMoonSpans.counts?.source_records!==12)errors.push("AUTUMN MOON V44 source count must be 12");
if(autumnMoonSpans.scope?.wave2_included!==false)errors.push("AUTUMN MOON V44 must not include wave2");
if(autumnMoonSpans.scope?.raw_substring_enumeration!==false)errors.push("AUTUMN MOON V44 must not enumerate raw substrings");
if(autumnMoonSpans.counts?.phrase_instances!==60||(autumnMoonSpans.units?.phrase_units??[]).length!==60)errors.push("AUTUMN MOON V44 phrase count must be 60");
for(const u of autumnMoonSpans.units?.phrase_units??[]){if(![5,7].includes(u.span_length))errors.push(`AUTUMN MOON V44 invalid phrase span: ${u.id} ${u.span_length}`);}
if(autumnMoonSpans.counts?.pivot_units!==(autumnMoonSpans.units?.pivot_units??[]).length)errors.push("AUTUMN MOON V44 pivot count mismatch");
for(const u of autumnMoonSpans.units?.pivot_units??[]){if(u.span_length!==3||!isPalindrome(u.reading))errors.push(`AUTUMN MOON V44 bad pivot: ${u.id}`);}
if(autumnMoonSpans.counts?.seam_units!==(autumnMoonSpans.units?.seam_units??[]).length)errors.push("AUTUMN MOON V44 seam count mismatch");
for(const u of autumnMoonSpans.units?.seam_units??[]){if(reverse(u.reading)!==u.reverse_reading)errors.push(`AUTUMN MOON V44 seam reverse mismatch: ${u.id}`);}
if((autumnMoonSpans.units?.seam_units??[]).find(x=>x.id==="seam:B2:ほと")?.transferable!==false)errors.push("AUTUMN MOON V44 ほと must remain non-transferable");
for(const id of ["seam:D2:はに","seam:D2:けふ","seam:D2:みな"]){if((autumnMoonSpans.units?.seam_units??[]).find(x=>x.id===id)?.transferable!==true)errors.push(`AUTUMN MOON V44 high seam not transferable: ${id}`);}
if(autumnMoonSpans.counts?.edge_units!==(autumnMoonSpans.units?.edge_units??[]).length)errors.push("AUTUMN MOON V44 edge count mismatch");
for(const u of autumnMoonSpans.units?.edge_units??[]){if(reverse(u.reading)!==u.reverse_reading)errors.push(`AUTUMN MOON V44 edge reverse mismatch: ${u.id}`);}
if(topicFirstGate.version!=="0.45")errors.push(`TOPIC FIRST GATE V45 version mismatch: ${topicFirstGate.version}`);
if(topicFirstGate.summary?.autumn_only_cento_candidates!==17||(topicFirstGate.candidates??[]).length!==17)errors.push("TOPIC FIRST GATE V45 count must be 17");
if(topicFirstGate.summary?.seam_complete_nonblocked!==10)errors.push("TOPIC FIRST GATE V45 seam-complete count must be 10");
if(topicFirstGate.summary?.mechanical_gate_matches_prior_review_set!==true)errors.push("TOPIC FIRST GATE V45 must reproduce prior review set");
const v45Gate=[...(topicFirstGate.mechanical_gate_ids??[])].sort().join(",");
const v40Review=[...(hybridCuration.reviews??[])].map(x=>x.id).sort().join(",");
if(v45Gate!==v40Review)errors.push(`TOPIC FIRST GATE V45 review-set mismatch: gate=${v45Gate} review=${v40Review}`);
for(const x of topicFirstGate.candidates??[]){if(!isPalindrome(x.reading))errors.push(`TOPIC FIRST GATE V45 non-palindrome: ${x.id}`);if(!x.all_five_phrases_attested)errors.push(`TOPIC FIRST GATE V45 phrase gap: ${x.id}`);}
if(autumnMoonMicrogrammar.version!=="0.46")errors.push(`AUTUMN MOON V46 version mismatch: ${autumnMoonMicrogrammar.version}`);
if(autumnMoonMicrogrammar.counts?.total_outputs!==4||(autumnMoonMicrogrammar.outputs??[]).length!==4)errors.push("AUTUMN MOON V46 output count must be 4");
if(autumnMoonMicrogrammar.counts?.historical_sources!==1||autumnMoonMicrogrammar.counts?.novel_cento!==3)errors.push("AUTUMN MOON V46 source/novel counts mismatch");
const v46Ids=[...(autumnMoonMicrogrammar.outputs??[])].map(x=>x.id).sort().join(",");
if(v46Ids!==["hybrid-008","hybrid-016","hybrid-022","shoju-035"].sort().join(","))errors.push(`AUTUMN MOON V46 output ids mismatch: ${v46Ids}`);
const v46A=new Map((autumnMoonMicrogrammar.variable_factors?.A??[]).map(x=>[x.id,x.reading]));
const v46E=new Map((autumnMoonMicrogrammar.variable_factors?.E??[]).map(x=>[x.id,x.reading]));
for(const x of autumnMoonMicrogrammar.outputs??[]){const A=v46A.get(x.A_option),E=v46E.get(x.E_option),B=autumnMoonMicrogrammar.fixed_factors?.B?.reading,C=autumnMoonMicrogrammar.fixed_factors?.C?.reading,D=autumnMoonMicrogrammar.fixed_factors?.D?.reading;const expected=A+B+C+D+E+reverse(D)+reverse(C)+reverse(B)+reverse(A);if(x.reading!==expected||!isPalindrome(x.reading))errors.push(`AUTUMN MOON V46 derivation mismatch: ${x.id}`);}
if(autumnMoonControl.version!=="0.47")errors.push(`AUTUMN MOON V47 version mismatch: ${autumnMoonControl.version}`);
if(autumnMoonControl.counts?.total_outputs!==4||(autumnMoonControl.outputs??[]).length!==4)errors.push("AUTUMN MOON V47 output count must be 4");
if(autumnMoonControl.comparison?.human_review_pattern?.strong_or_promising_novel!==0)errors.push("AUTUMN MOON V47 control must have zero strong/promising novel outputs");
const v47A=new Map((autumnMoonControl.variable_factors?.A??[]).map(x=>[x.id,x.reading]));
for(const x of autumnMoonControl.outputs??[]){const A=v47A.get(x.A_option),B=autumnMoonControl.fixed_factors?.B?.reading,C=autumnMoonControl.fixed_factors?.C?.reading,D=autumnMoonControl.fixed_factors?.D?.reading,E=autumnMoonControl.fixed_factors?.E?.reading;const expected=A+B+C+D+E+reverse(D)+reverse(C)+reverse(B)+reverse(A);if(x.reading!==expected||!isPalindrome(x.reading))errors.push(`AUTUMN MOON V47 derivation mismatch: ${x.id}`);}
if(sceneGate.version!=="0.48")errors.push(`SCENE GATE V48 version mismatch: ${sceneGate.version}`);
if(sceneGate.status!=="research-hypothesis")errors.push("SCENE GATE V48 must remain a research hypothesis");
if((sceneGate.generic_tags??[]).join(",")!=="秋,月")errors.push("SCENE GATE V48 generic tags changed unexpectedly");
if((sceneGate.case_studies??[]).length!==2)errors.push("SCENE GATE V48 must contain positive and control case studies");
if(!sceneGate.design_consequences?.includes("Missing scene metadata is not evidence of incompatibility; it triggers human review rather than rejection."))errors.push("SCENE GATE V48 missing conservative hold rule");
if(factorSceneSignatures.version!=="0.49")errors.push(`FACTOR SCENE V49 version mismatch: ${factorSceneSignatures.version}`);
if((factorSceneSignatures.signatures??[]).length!==9)errors.push(`FACTOR SCENE V49 signature count must be 9: ${(factorSceneSignatures.signatures??[]).length}`);
const v49Hani=(factorSceneSignatures.signatures??[]).find(x=>x.id==="scene:D:はに");
if(!v49Hani||v49Hani.confidence!=="high-structural"||!(v49Hani.scene_tags_forward??[]).includes("葉")||!(v49Hani.scene_tags_reverse??[]).includes("庭"))errors.push("FACTOR SCENE V49 はに signature weakened or changed");
const v49Hare=(factorSceneSignatures.signatures??[]).find(x=>x.id==="scene:A:はれつみよ");
if(!v49Hare||v49Hare.confidence!=="unresolved"||(v49Hare.scene_tags??[]).length!==0)errors.push("FACTOR SCENE V49 はれつみよ must remain unresolved");
const v49Ku4=(factorSceneSignatures.signatures??[]).find(x=>x.id==="scene:ku4:にはのきはもる");
if(!v49Ku4||(v49Ku4.unresolved??[]).includes("きはもる の漢字・語義")!==true)errors.push("FACTOR SCENE V49 must preserve きはもる uncertainty");
for(const x of factorSceneSignatures.signatures??[]){if(String(x.confidence??"").includes("source-image-confirmed"))errors.push(`FACTOR SCENE V49 must not claim source-image confirmation: ${x.id}`);}
if(seamReviewQueue.version!=="0.50")errors.push(`SEAM REVIEW V50 version mismatch: ${seamReviewQueue.version}`);
if(seamReviewQueue.summary?.blocked_candidates!==7)errors.push("SEAM REVIEW V50 blocked candidate count must be 7");
if(seamReviewQueue.summary?.unique_unclassified_seams!==3||(seamReviewQueue.queue??[]).length!==3)errors.push("SEAM REVIEW V50 unique seam count must be 3");
const v50Impact=(seamReviewQueue.queue??[]).reduce((n,x)=>n+(x.impact_count??0),0);
if(v50Impact!==7)errors.push(`SEAM REVIEW V50 impact total must be 7: ${v50Impact}`);
const v50Tama=(seamReviewQueue.queue??[]).find(x=>x.id==="review:B:たま");
if(!v50Tama||v50Tama.corpus_evidence?.known_reverse_side_signature?.transferable!==false)errors.push("SEAM REVIEW V50 must preserve blocked reverse-side また evidence");
if(seamEvidence.version!=="0.51")errors.push(`SEAM EVIDENCE V51 version mismatch: ${seamEvidence.version}`);
if(seamEvidence.evidence_policy?.source_image_checked!==false)errors.push("SEAM EVIDENCE V51 must not claim source-image inspection");
if((seamEvidence.findings??[]).length!==3)errors.push("SEAM EVIDENCE V51 finding count must be 3");
const v51Tama=(seamEvidence.findings??[]).find(x=>x.id==="evidence:B:たま");
const v51Musu=(seamEvidence.findings??[]).find(x=>x.id==="evidence:D:むす");
const v51Kota=(seamEvidence.findings??[]).find(x=>x.id==="evidence:D:こた");
if(v51Tama?.proposed_signature?.transferable!=="conditional-source-specific")errors.push("SEAM EVIDENCE V51 たま must remain source-specific conditional");
if(v51Musu?.proposed_signature?.transferable!=="conditional-source-specific")errors.push("SEAM EVIDENCE V51 むす must remain source-specific conditional");
if(v51Kota?.proposed_signature?.transferable!==false)errors.push("SEAM EVIDENCE V51 こた must remain blocked");
if((seamEvidence.evidence_sources??[]).length<3)errors.push("SEAM EVIDENCE V51 provenance sources missing");
if(sourceSpecificLane.version!=="0.52")errors.push(`SOURCE-SPECIFIC V52 version mismatch: ${sourceSpecificLane.version}`);
if(sourceSpecificLane.summary?.previously_unclassified!==7)errors.push("SOURCE-SPECIFIC V52 must start from 7 unclassified candidates");
if(sourceSpecificLane.summary?.semantic_review_eligible_source_specific!==4||(sourceSpecificLane.eligible??[]).length!==4)errors.push("SOURCE-SPECIFIC V52 eligible count must be 4");
if(sourceSpecificLane.summary?.still_blocked!==3)errors.push("SOURCE-SPECIFIC V52 blocked count must be 3");
if(sourceSpecificLane.summary?.global_seams_promoted!==0)errors.push("SOURCE-SPECIFIC V52 must not promote global seams");
for(const x of sourceSpecificLane.eligible??[]){if(!isPalindrome(x.reading))errors.push(`SOURCE-SPECIFIC V52 non-palindrome: ${x.id}`);}
if(haniPivotExchange.version!=="0.53")errors.push(`HANI PIVOT V53 version mismatch: ${haniPivotExchange.version}`);
if(haniPivotExchange.counts?.total_outputs!==4||(haniPivotExchange.outputs??[]).length!==4)errors.push("HANI PIVOT V53 output count must be 4");
if(haniPivotExchange.invariant?.D!=="はに")errors.push("HANI PIVOT V53 D must remain はに");
for(const x of haniPivotExchange.outputs??[]){if(!isPalindrome(x.reading))errors.push(`HANI PIVOT V53 non-palindrome: ${x.id}`);}
const v53h19=(haniPivotExchange.outputs??[]).find(x=>x.id==="hybrid-019");
if(v53h19?.review?.status!=="promising-but-parse-needed")errors.push("HANI PIVOT V53 hybrid-019 review status changed");
if(pivotSurvey.version!=="0.54")errors.push(`PIVOT SURVEY V54 version mismatch: ${pivotSurvey.version}`);
if(pivotSurvey.summary?.repeated_D_groups!==5)errors.push("PIVOT SURVEY V54 repeated D groups must be 5");
if(pivotSurvey.summary?.next_test_group!=="みつ")errors.push("PIVOT SURVEY V54 next test group must remain みつ");
if(mitsuPivotExchange.version!=="0.55")errors.push(`MITSU PIVOT V55 version mismatch: ${mitsuPivotExchange.version}`);
if(mitsuPivotExchange.invariant?.D!=="みつ"||mitsuPivotExchange.invariant?.reverse_D!=="つみ")errors.push("MITSU PIVOT V55 D signature changed");
if((mitsuPivotExchange.outputs??[]).length!==2)errors.push("MITSU PIVOT V55 must contain 2 directed swap outputs");
for(const x of mitsuPivotExchange.outputs??[]){if(!isPalindrome(x.reading))errors.push(`MITSU PIVOT V55 non-palindrome: ${x.id}`);}
const v55h2=(mitsuPivotExchange.outputs??[]).find(x=>x.id==="hybrid-002");
const v55h17=(mitsuPivotExchange.outputs??[]).find(x=>x.id==="hybrid-017");
if(v55h2?.revised_operation_analysis?.research_status!=="promising-but-source-parse-needed")errors.push("MITSU PIVOT V55 hybrid-002 status changed");
if(v55h17?.revised_operation_analysis?.research_status!=="hold-semantic-role-mismatch")errors.push("MITSU PIVOT V55 hybrid-017 status changed");
if(semanticRoleGate.version!=="0.56")errors.push(`SEMANTIC ROLE V56 version mismatch: ${semanticRoleGate.version}`);
if(semanticRoleGate.status!=="research-hypothesis")errors.push("SEMANTIC ROLE V56 must remain a research hypothesis");
if((semanticRoleGate.case_studies??[]).length!==4)errors.push("SEMANTIC ROLE V56 case count must be 4");
const v56h17=(semanticRoleGate.case_studies??[]).find(x=>x.id==="hybrid-017");
if(v56h17?.outcome!=="incompatible-for-this-host")errors.push("SEMANTIC ROLE V56 hybrid-017 outcome changed");
const v56h2=(semanticRoleGate.case_studies??[]).find(x=>x.id==="hybrid-002");
if(v56h2?.outcome!=="review-needed")errors.push("SEMANTIC ROLE V56 hybrid-002 must remain review-needed");
if(pivotPipeline.version!=="0.57")errors.push(`PIVOT PIPELINE V57 version mismatch: ${pivotPipeline.version}`);
if(pivotPipeline.corpus?.novel_directed_E_swaps!==12||(pivotPipeline.results??[]).length!==12)errors.push("PIVOT PIPELINE V57 total must be 12");
if(pivotPipeline.summary?.reaches_deep_review!==3)errors.push("PIVOT PIPELINE V57 deep-review count must be 3");
if(pivotPipeline.summary?.automatic_acceptance!==0)errors.push("PIVOT PIPELINE V57 must not auto-accept");
const v57Deep=(pivotPipeline.results??[]).filter(x=>String(x.stage).startsWith("deep-review")).map(x=>x.id).sort().join(",");
if(v57Deep!==["hybrid-002","hybrid-016","hybrid-019"].sort().join(","))errors.push(`PIVOT PIPELINE V57 deep-review set mismatch: ${v57Deep}`);
for(const x of pivotPipeline.results??[]){if(!isPalindrome(x.reading))errors.push(`PIVOT PIPELINE V57 non-palindrome: ${x.id}`);}
if(generatorContract.version!=="0.58")errors.push(`GENERATOR CONTRACT V58 version mismatch: ${generatorContract.version}`);
if(generatorContract.mode!=="research-only")errors.push("GENERATOR CONTRACT V58 must remain research-only");
if(generatorContract.public_ui_enabled!==false)errors.push("GENERATOR CONTRACT V58 public UI must remain disabled");
const v58Central=(generatorContract.supported_operations??[]).find(x=>x.id==="central-E-swap");
if(!v58Central)errors.push("GENERATOR CONTRACT V58 missing central-E-swap");
const v58General=(generatorContract.supported_operations??[]).find(x=>x.id==="general-factor-crossover");
if(v58General?.enabled!==false)errors.push("GENERATOR CONTRACT V58 general factor crossover must remain disabled");
if(generatorContract.trace_policy?.accepted_status_not_generated_by_machine!==true)errors.push("GENERATOR CONTRACT V58 must forbid machine accepted status");
if((generatorContract.regression_examples?.positive??[]).sort().join(",")!==["hybrid-016","hybrid-019"].sort().join(","))errors.push("GENERATOR CONTRACT V58 positive fixtures changed");
if(hybrid002DeepReview.version!=="0.99")errors.push(`HYBRID002 V99 version mismatch: ${hybrid002DeepReview.version}`);
if(hybrid002DeepReview.candidate?.id!=="hybrid-002")errors.push("HYBRID002 V99 candidate id mismatch");
if(hybrid002DeepReview.finding?.normalization_collision!==true)errors.push("HYBRID002 V99 must record normalization collision");
if(hybrid002DeepReview.evidence?.donor_D?.pre_normalization_reading!=="みづ")errors.push("HYBRID002 V99 donor D must preserve pre-normalization みづ");
if(hybrid002DeepReview.evidence?.host_D?.transcribed_D!=="みつ")errors.push("HYBRID002 V99 host D transcription must remain みつ");
if(hybrid002DeepReview.evidence?.host_D?.morphology_equivalence_with_donor_confirmed!==false)errors.push("HYBRID002 V99 must not claim D morphology equivalence");
if(hybrid002DeepReview.verdict?.current_status!=="hold-morphology-normalization-collision")errors.push("HYBRID002 V99 verdict changed");
if(hybrid002DeepReview.verdict?.automatic_acceptance!==false||hybrid002DeepReview.verdict?.positive_fixture!==false)errors.push("HYBRID002 V99 must not promote candidate");
if((hybrid002DeepReview.paired_impact?.affected_ids??[]).sort().join(",")!==["hybrid-002","hybrid-017"].sort().join(","))errors.push("HYBRID002 V99 paired impact set changed");
if(hybrid002DeepReview.generator_correction?.v59_frozen_snapshot_preserved!==true)errors.push("HYBRID002 V99 must preserve v59 as historical snapshot");
if(pivotMorphologyGuard.version!=="1.00")errors.push(`PIVOT MORPHOLOGY V100 version mismatch: ${pivotMorphologyGuard.version}`);
if(pivotMorphologyGuard.policy?.normalized_D_equality_is_sufficient!==false)errors.push("PIVOT MORPHOLOGY V100 normalized D must not be sufficient");
if(pivotMorphologyGuard.normalization_collision?.morphology_equivalence_confirmed!==false)errors.push("PIVOT MORPHOLOGY V100 must keep mitsu morphology unresolved");
if((pivotMorphologyGuard.invalidated_candidate_ids_for_current_generator??[]).sort().join(",")!==["hybrid-002","hybrid-017"].sort().join(","))errors.push("PIVOT MORPHOLOGY V100 invalidated set changed");
if(pivotMorphologyGuard.counts?.current_candidates!==10)errors.push("PIVOT MORPHOLOGY V100 current candidate count must be 10");
if(generatedPivotV100.version!=="1.00"||generatedPivotV100.candidate_count!==10)errors.push("GENERATED PIVOT V100 count/version mismatch");
const generatedPivotV100Ids=(generatedPivotV100.candidates??[]).map(x=>x.id);
for(const id of ["hybrid-002","hybrid-017"])if(generatedPivotV100Ids.includes(id))errors.push(`GENERATED PIVOT V100 normalization-collision leak: ${id}`);
for(const id of ["hybrid-016","hybrid-019"])if(!generatedPivotV100Ids.includes(id))errors.push(`GENERATED PIVOT V100 positive research candidate missing: ${id}`);

if(shoju068SourceReview.version!=="1.01")errors.push(`SHOJU068 V101 version mismatch: ${shoju068SourceReview.version}`);
if(shoju068SourceReview.decision?.source_image_verified!==false)errors.push("SHOJU068 V101 must preserve source-image-unverified state");
if(shoju068SourceReview.decision?.scholarly_transcription_verified!==true)errors.push("SHOJU068 V101 transcription verification missing");
if(shoju068SourceReview.decision?.automatic_reopen_allowed!==false)errors.push("SHOJU068 V101 must not reopen automatically");
if(shoju068SourceReview.morphology_comparison?.lexical_identity_equal!==false)errors.push("SHOJU068 V101 must keep 水 and interpreted 三つ lexically distinct");

if(mataOuterReview.version!=="1.02")errors.push(`MATA OUTER V102 version mismatch: ${mataOuterReview.version}`);
if(mataOuterReview.finding?.morphology_equivalence_confirmed!==false)errors.push("MATA OUTER V102 must not claim B morphology equivalence");
if(mataOuterReview.finding?.morphology_non_equivalence_proven!==false)errors.push("MATA OUTER V102 must preserve poem1 parse uncertainty");
if(mataOuterReview.decision?.positive_family!==false)errors.push("MATA OUTER V102 must remain negative/hold lane");
if(mataOuterReview.decision?.B_mata_global_transferable!==false)errors.push("MATA OUTER V102 must not promote B=また globally");
const mataAffected=(mataOuterReview.candidate_impact??[]).map(x=>x.id).sort().join(",");
if(mataAffected!==["hybrid-001","hybrid-012"].sort().join(","))errors.push(`MATA OUTER V102 affected set mismatch: ${mataAffected}`);

if(musuMoonFamily.version!=="1.03")errors.push(`MUSU MOON V103 version mismatch: ${musuMoonFamily.version}`);
if(musuMoonFamily.operation?.source_specific_corridor?.D!=="むす")errors.push("MUSU MOON V103 D corridor must remain むす");
if(musuMoonFamily.operation?.source_specific_corridor?.global_transferability!==false)errors.push("MUSU MOON V103 must keep D=むす source-specific");
if((musuMoonFamily.outputs??[]).length!==4)errors.push("MUSU MOON V103 output count must be 4");
for(const x of musuMoonFamily.outputs??[]){
  if(!isPalindrome(x.reading))errors.push(`MUSU MOON V103 non-palindrome: ${x.id}`);
  for(const field of ["id","operation","reading","meter","factors","strict_palindrome","host_source_id","donor_source_ids","provenance","attestation_trace","morphology_trace","scene_trace","semantic_role_trace","source_confidence_trace","review_status","cautions"])if(!(field in x))errors.push(`MUSU MOON V103 missing field ${field}: ${x.id}`);
}
const musu7=(musuMoonFamily.outputs??[]).find(x=>x.id==="hybrid-007");
const musu3=(musuMoonFamily.outputs??[]).find(x=>x.id==="hybrid-003");
const musu14=(musuMoonFamily.outputs??[]).find(x=>x.id==="hybrid-014");
if(musu7?.review_status!=="promising-but-parse-needed")errors.push("MUSU MOON V103 hybrid-007 promotion drift");
if(musu3?.review_status!=="hold-scene-mismatch")errors.push("MUSU MOON V103 hybrid-003 control drift");
if(musu14?.review_status!=="hold-source-confirmation")errors.push("MUSU MOON V103 hybrid-014 control drift");
if(musuMoonFamily.summary?.automatic_acceptance!==0)errors.push("MUSU MOON V103 automatic acceptance must remain zero");
if(musuMoonFamily.family_verdict?.status!=="third-positive-family-candidate-not-yet-established")errors.push("MUSU MOON V103 family verdict changed");

if(generatedMusuMoonV104.version!=="1.04"||generatedMusuMoonV104.candidate_count!==4)errors.push("GENERATED MUSU MOON V104 count/version mismatch");
const musuV104Ids=(generatedMusuMoonV104.candidates??[]).map(x=>x.id).sort().join(",");
if(musuV104Ids!==["shoju-add-109","hybrid-003","hybrid-007","hybrid-014"].sort().join(","))errors.push(`GENERATED MUSU MOON V104 ids mismatch: ${musuV104Ids}`);

if(hybrid007SyntaxV105.version!=="1.05")errors.push(`HYBRID007 V105 version mismatch: ${hybrid007SyntaxV105.version}`);
if(hybrid007SyntaxV105.verdict?.current_review_status!=="promising-but-parse-needed")errors.push("HYBRID007 V105 status must remain promising-but-parse-needed");
if(hybrid007SyntaxV105.verdict?.promote_to_deep_review_supported!==false)errors.push("HYBRID007 V105 must not promote automatically");
if(hybrid007SyntaxV105.verdict?.third_positive_family_established!==false)errors.push("HYBRID007 V105 must not establish third family");
if(hybrid007SyntaxV105.review_basis?.official_article_metadata?.pdf_content_directly_inspected_in_this_review!==false)errors.push("HYBRID007 V105 must preserve PDF-not-directly-inspected state");
const h7Second=(hybrid007SyntaxV105.segment_reviews??[]).find(x=>x.segment==="すむはらそみる");
if(h7Second?.voicing_status!=="unresolved")errors.push("HYBRID007 V105 voicing must remain unresolved");
if(hybrid007SyntaxV105.new_safety_rule?.id!=="source-voicing-and-lexeme-ambiguity-guard")errors.push("HYBRID007 V105 safety rule missing");
if(hybrid007SyntaxV105.new_safety_rule?.applies_beyond_hybrid_007!==true)errors.push("HYBRID007 V105 safety rule must apply beyond candidate");

if(wave2TravelMahaV106.version!=="1.06")errors.push(`WAVE2 TRAVEL V106 version mismatch: ${wave2TravelMahaV106.version}`);
if(wave2TravelMahaV106.baseline_policy?.fixed50_unchanged!==true)errors.push("WAVE2 TRAVEL V106 must not change fixed50");
if(wave2TravelMahaV106.baseline_policy?.wave2_verified_count_unchanged!==14||wave2TravelMahaV106.baseline_policy?.wave2_held_count_unchanged!==5)errors.push("WAVE2 TRAVEL V106 wave2 counts drift");
if(wave2TravelMahaV106.operation?.shared_B!=="まは"||wave2TravelMahaV106.operation?.reverse_B!=="はま")errors.push("WAVE2 TRAVEL V106 B seam changed");
if(wave2TravelMahaV106.shared_B_review?.forward_morphology_compatibility!=="strongly-supported-by-identical-surface-continuation")errors.push("WAVE2 TRAVEL V106 forward morphology support changed");
if(wave2TravelMahaV106.shared_B_review?.reverse_B_lexeme!=="unresolved")errors.push("WAVE2 TRAVEL V106 reverse B must remain unresolved");
if(wave2TravelMahaV106.shared_B_review?.source_image_checked!==false)errors.push("WAVE2 TRAVEL V106 must not claim source image check");
if((wave2TravelMahaV106.generated_prospects??[]).length!==2)errors.push("WAVE2 TRAVEL V106 prospect count must be 2");
for(const x of wave2TravelMahaV106.generated_prospects??[]){
  if(!isPalindrome(x.reading))errors.push(`WAVE2 TRAVEL V106 non-palindrome: ${x.id}`);
  if(x.meter.map(y=>[...y].length).join(",")!=="5,7,5,7,7")errors.push(`WAVE2 TRAVEL V106 meter mismatch: ${x.id}`);
  if(x.review_status!=="hold-source-confirmation")errors.push(`WAVE2 TRAVEL V106 status drift: ${x.id}`);
}
if(wave2TravelMahaV106.summary?.positive_family_established!==false||wave2TravelMahaV106.summary?.automatic_acceptance!==0)errors.push("WAVE2 TRAVEL V106 must remain prospect-only");

if(wave2RepeatedSeamV107.version!=="1.07")errors.push(`WAVE2 SEAM V107 version mismatch: ${wave2RepeatedSeamV107.version}`);
if(wave2RepeatedSeamV107.scope?.fixed50_unchanged!==true)errors.push("WAVE2 SEAM V107 must preserve fixed50");
if(wave2RepeatedSeamV107.scope?.wave2_verified!==14||wave2RepeatedSeamV107.scope?.wave2_held!==5)errors.push("WAVE2 SEAM V107 wave2 counts drift");
if((wave2RepeatedSeamV107.repeated_B_groups??[]).length!==6)errors.push("WAVE2 SEAM V107 repeated B group count must be 6");
if((wave2RepeatedSeamV107.repeated_D_groups??[]).length!==6)errors.push("WAVE2 SEAM V107 repeated D group count must be 6");
const v107Maha=(wave2RepeatedSeamV107.repeated_B_groups??[]).find(x=>x.B==="まは");
if(v107Maha?.classification!=="same-title-family-novel")errors.push("WAVE2 SEAM V107 B=まは classification changed");
if(v107Maha?.novel_exchange_value!=="best-wave2-outer-frame-prospect")errors.push("WAVE2 SEAM V107 B=まは priority changed");
if(wave2RepeatedSeamV107.summary?.new_safe_positive_family_established!==false)errors.push("WAVE2 SEAM V107 must not establish a positive family");
if(wave2RepeatedSeamV107.source_access_audit?.direct_image_inspection_completed!==false)errors.push("WAVE2 SEAM V107 must preserve image-not-inspected state");

if(generatedWave2TravelV108.version!=="1.08"||generatedWave2TravelV108.candidate_count!==4)errors.push("GENERATED WAVE2 TRAVEL V108 count/version mismatch");
const v108Ids=(generatedWave2TravelV108.candidates??[]).map(x=>x.id).sort().join(",");
if(v108Ids!==["shoju-next-090","shoju-next-093","wave2-travel-090-host-093-outer","wave2-travel-093-host-090-outer"].sort().join(","))errors.push(`GENERATED WAVE2 TRAVEL V108 ids mismatch: ${v108Ids}`);
for(const x of generatedWave2TravelV108.candidates??[]){
  if(!isPalindrome(x.reading))errors.push(`GENERATED WAVE2 TRAVEL V108 non-palindrome: ${x.id}`);
  if(x.meter.map(y=>[...y].length).join(",")!=="5,7,5,7,7")errors.push(`GENERATED WAVE2 TRAVEL V108 meter mismatch: ${x.id}`);
  if(x.morphology_trace?.reverse_B_lexeme!=="unresolved")errors.push(`GENERATED WAVE2 TRAVEL V108 reverse B lexical drift: ${x.id}`);
  if(x.source_confidence_trace?.source_image_checked!==false)errors.push(`GENERATED WAVE2 TRAVEL V108 source-image claim drift: ${x.id}`);
  if(["accepted","natural","deep-review-supported"].includes(x.review_status))errors.push(`GENERATED WAVE2 TRAVEL V108 premature positive: ${x.id}`);
}
const v108Novel=(generatedWave2TravelV108.candidates??[]).filter(x=>x.id.startsWith("wave2-travel-"));
if(v108Novel.length!==2||v108Novel.some(x=>x.review_status!=="hold-source-confirmation"))errors.push("GENERATED WAVE2 TRAVEL V108 novel prospects must remain source-held");

if(wave2TravelSyntaxV109.version!=="1.09")errors.push(`WAVE2 TRAVEL SYNTAX V109 version mismatch: ${wave2TravelSyntaxV109.version}`);
if(wave2TravelSyntaxV109.baseline_policy?.fixed50_unchanged!==true)errors.push("WAVE2 TRAVEL SYNTAX V109 must preserve fixed50");
if(wave2TravelSyntaxV109.baseline_policy?.wave2_verified_count_unchanged!==14||wave2TravelSyntaxV109.baseline_policy?.wave2_held_count_unchanged!==5)errors.push("WAVE2 TRAVEL SYNTAX V109 wave2 counts drift");
if(wave2TravelSyntaxV109.sources?.yamauchi_1974?.pdf_or_source_image_directly_inspected_in_this_review!==false)errors.push("WAVE2 TRAVEL SYNTAX V109 must not claim PDF/source-image inspection");
if(wave2TravelSyntaxV109.new_safety_rule?.id!=="author-parallel-is-not-source-glyph-evidence")errors.push("WAVE2 TRAVEL SYNTAX V109 author-parallel guard missing");
if(wave2TravelSyntaxV109.new_safety_rule?.applies_beyond_travel_family!==true)errors.push("WAVE2 TRAVEL SYNTAX V109 guard must apply beyond travel family");
if(wave2TravelSyntaxV109.verdict?.source_90_parse_status!=="partial-support-with-unresolved-ku5")errors.push("WAVE2 TRAVEL SYNTAX V109 source 90 status drift");
if(wave2TravelSyntaxV109.verdict?.source_93_parse_status!=="partial-lexical-support-with-unresolved-syntax-and-ku5")errors.push("WAVE2 TRAVEL SYNTAX V109 source 93 status drift");
if(wave2TravelSyntaxV109.verdict?.travel_family_status!=="hold-source-confirmation")errors.push("WAVE2 TRAVEL SYNTAX V109 family must remain source-held");
if(wave2TravelSyntaxV109.verdict?.generator_v108_reopen!==false)errors.push("WAVE2 TRAVEL SYNTAX V109 must not reopen v108 generator");
if(wave2TravelSyntaxV109.verdict?.positive_family_established!==false||wave2TravelSyntaxV109.verdict?.automatic_acceptance!==false)errors.push("WAVE2 TRAVEL SYNTAX V109 must not promote family");
const v109Impact=(wave2TravelSyntaxV109.novel_candidate_impact??[]).map(x=>[x.id,x.current_status]);
if(v109Impact.length!==2||v109Impact.some(([,st])=>st!=="hold-source-confirmation"))errors.push("WAVE2 TRAVEL SYNTAX V109 novel statuses must remain hold-source-confirmation");
for(const [id,status] of v109Impact){
  const v108=generatedWave2TravelV108.candidates?.find(x=>x.id===id);
  if(v108?.review_status!==status)errors.push(`WAVE2 TRAVEL SYNTAX V109/V108 status mismatch: ${id}`);
}

if(fixed50OperationAuditV110.version!=="1.10")errors.push(`FIXED50 OP AUDIT V110 version mismatch: ${fixed50OperationAuditV110.version}`);
if(fixed50OperationAuditV110.inputs?.source_sample_count!==50||fixed50OperationAuditV110.inputs?.hybrid_count!==51)errors.push("FIXED50 OP AUDIT V110 input counts drift");
if(fixed50OperationAuditV110.results?.minimum_distance_counts?.["1"]!==38||fixed50OperationAuditV110.results?.minimum_distance_counts?.["2"]!==13)errors.push("FIXED50 OP AUDIT V110 distance counts drift");
const v110single=fixed50OperationAuditV110.results?.single_factor_findings;
if(v110single?.candidate_count!==38||JSON.stringify(v110single?.observed_patterns)!==JSON.stringify(["A","E"]))errors.push("FIXED50 OP AUDIT V110 single-factor space changed");
for(const slot of ["B","C","D"])if(!v110single?.unobserved_patterns?.includes(slot))errors.push(`FIXED50 OP AUDIT V110 must keep ${slot}-only unsupported`);
if(fixed50OperationAuditV110.policy?.general_factor_crossover_enabled!==false)errors.push("FIXED50 OP AUDIT V110 must keep general crossover disabled");
if(fixed50OperationAuditV110.policy?.fixed50_unchanged!==true)errors.push("FIXED50 OP AUDIT V110 must preserve fixed50");

if(wave2GraphAuditV111.version!=="1.11")errors.push(`WAVE2 GRAPH AUDIT V111 version mismatch: ${wave2GraphAuditV111.version}`);
if(wave2GraphAuditV111.scope?.fixed_sources!==50||wave2GraphAuditV111.scope?.wave2_verified_sources!==14||wave2GraphAuditV111.scope?.wave2_held_sources_excluded!==5)errors.push("WAVE2 GRAPH AUDIT V111 scope counts drift");
if(wave2GraphAuditV111.scope?.wave2_integrated_into_fixed_baseline!==false)errors.push("WAVE2 GRAPH AUDIT V111 must remain research graph only");
if(wave2GraphAuditV111.counts?.novel_paths_involving_wave2_provenance!==48||wave2GraphAuditV111.counts?.genuinely_new_paths_beyond_v035!==39)errors.push("WAVE2 GRAPH AUDIT V111 graph counts drift");
if(wave2GraphAuditV111.counts?.wave2_involving_min_distance_1!==35||wave2GraphAuditV111.counts?.wave2_involving_min_distance_2!==13)errors.push("WAVE2 GRAPH AUDIT V111 distance counts drift");
if(wave2GraphAuditV111.minimum_distance_patterns?.distance_1?.A!==24||wave2GraphAuditV111.minimum_distance_patterns?.distance_1?.E!==11)errors.push("WAVE2 GRAPH AUDIT V111 A/E min1 counts drift");
for(const slot of ["B","C","D"])if(wave2GraphAuditV111.minimum_distance_patterns?.distance_1?.[slot]!==0)errors.push(`WAVE2 GRAPH AUDIT V111 ${slot}-only must remain zero`);
if(wave2GraphAuditV111.policy?.general_factor_crossover_enabled!==false||wave2GraphAuditV111.policy?.operation_contract_expansion!==false)errors.push("WAVE2 GRAPH AUDIT V111 must not expand crossover contract");

if(yamauchiVisibleV112.version!=="1.12")errors.push(`YAMAUCHI VISIBLE V112 version mismatch: ${yamauchiVisibleV112.version}`);
if(yamauchiVisibleV112.source_layers?.readable_article_mirror?.poem_specific_transcription_readable!==true)errors.push("YAMAUCHI VISIBLE V112 poem-specific transcription must remain readable");
if(yamauchiVisibleV112.source_layers?.readable_article_mirror?.direct_article_pdf_inspection!==false)errors.push("YAMAUCHI VISIBLE V112 must not claim direct PDF inspection");
if(yamauchiVisibleV112.source_layers?.readable_article_mirror?.direct_original_edo_source_image_inspection!==false)errors.push("YAMAUCHI VISIBLE V112 must not claim original image inspection");
if(yamauchiVisibleV112.travel_family_effect?.sources_90_93_poem_specific_scholarly_transcription_confirmed!==true)errors.push("YAMAUCHI VISIBLE V112 must confirm 90/93 scholarly transcription layer");
if(yamauchiVisibleV112.travel_family_effect?.automatic_candidate_status_change!==false)errors.push("YAMAUCHI VISIBLE V112 source overlay must not auto-change statuses");
if(yamauchiVisibleV112.wave2_policy_effect?.verified_count_unchanged!==14||yamauchiVisibleV112.wave2_policy_effect?.held_count_unchanged!==5)errors.push("YAMAUCHI VISIBLE V112 wave2 counts drift");
const v112p89=(yamauchiVisibleV112.poem_reviews??[]).find(x=>x.source_number===89);
const v112p94=(yamauchiVisibleV112.poem_reviews??[]).find(x=>x.source_number===94);
if(v112p89?.promotion_status!=="hold-by-existing-source-image-promotion-policy")errors.push("YAMAUCHI VISIBLE V112 poem 89 must remain held by policy");
if(v112p94?.current_hold_class!=="hold-strict-orthographic-equivalence")errors.push("YAMAUCHI VISIBLE V112 poem 94 hold class drift");

if(wave2TravelDeepV113.version!=="1.13")errors.push(`WAVE2 TRAVEL DEEP V113 version mismatch: ${wave2TravelDeepV113.version}`);
if(wave2TravelDeepV113.family_verdict?.status!=="third-positive-family-candidate-not-yet-established")errors.push("WAVE2 TRAVEL DEEP V113 family verdict drift");
if(wave2TravelDeepV113.family_verdict?.best_novel_candidate!=="wave2-travel-090-host-093-outer")errors.push("WAVE2 TRAVEL DEEP V113 best candidate drift");
if(wave2TravelDeepV113.family_verdict?.best_novel_status!=="promising-but-parse-needed")errors.push("WAVE2 TRAVEL DEEP V113 best status drift");
if(wave2TravelDeepV113.family_verdict?.established_positive_family!==false||wave2TravelDeepV113.family_verdict?.automatic_acceptance!==0)errors.push("WAVE2 TRAVEL DEEP V113 must not establish/accept family");
const v113best=(wave2TravelDeepV113.candidate_reviews??[]).find(x=>x.id==="wave2-travel-090-host-093-outer");
const v113reverse=(wave2TravelDeepV113.candidate_reviews??[]).find(x=>x.id==="wave2-travel-093-host-090-outer");
if(v113best?.current_status!=="promising-but-parse-needed")errors.push("WAVE2 TRAVEL DEEP V113 best candidate status drift");
if(v113reverse?.current_status!=="deep-review-needed")errors.push("WAVE2 TRAVEL DEEP V113 reverse candidate status drift");
if(v113best?.automatic_acceptance!==false||v113reverse?.automatic_acceptance!==false)errors.push("WAVE2 TRAVEL DEEP V113 automatic acceptance forbidden");

if(generatedWave2TravelV114.version!=="1.14"||generatedWave2TravelV114.candidate_count!==4)errors.push("GENERATED WAVE2 TRAVEL V114 count/version mismatch");
const v114Ids=(generatedWave2TravelV114.candidates??[]).map(x=>x.id).sort().join(",");
if(v114Ids!==["shoju-next-090","shoju-next-093","wave2-travel-090-host-093-outer","wave2-travel-093-host-090-outer"].sort().join(","))errors.push(`GENERATED WAVE2 TRAVEL V114 ids mismatch: ${v114Ids}`);
for(const x of generatedWave2TravelV114.candidates??[]){
  if(!isPalindrome(x.reading))errors.push(`GENERATED WAVE2 TRAVEL V114 non-palindrome: ${x.id}`);
  if(x.meter.map(y=>[...y].length).join(",")!=="5,7,5,7,7")errors.push(`GENERATED WAVE2 TRAVEL V114 meter mismatch: ${x.id}`);
  if(x.source_confidence_trace?.source_image_checked!==false)errors.push(`GENERATED WAVE2 TRAVEL V114 source-image claim drift: ${x.id}`);
  if(x.source_confidence_trace?.article_pdf_directly_inspected!==false)errors.push(`GENERATED WAVE2 TRAVEL V114 article-PDF claim drift: ${x.id}`);
  if(["accepted","natural","deep-review-supported"].includes(x.review_status))errors.push(`GENERATED WAVE2 TRAVEL V114 premature positive: ${x.id}`);
}
const v114best=(generatedWave2TravelV114.candidates??[]).find(x=>x.id==="wave2-travel-090-host-093-outer");
const v114reverse=(generatedWave2TravelV114.candidates??[]).find(x=>x.id==="wave2-travel-093-host-090-outer");
if(v114best?.review_status!=="promising-but-parse-needed"||v114best?.semantic_role_trace?.status!=="compatible-tentative")errors.push("GENERATED WAVE2 TRAVEL V114 best candidate drift");
if(v114reverse?.review_status!=="deep-review-needed"||v114reverse?.semantic_role_trace?.blocking_span!=="はまもくかもと")errors.push("GENERATED WAVE2 TRAVEL V114 reverse candidate drift");

if(wave2HeldPolicyV115.version!=="1.15")errors.push(`WAVE2 HELD POLICY V115 version mismatch: ${wave2HeldPolicyV115.version}`);
if(wave2HeldPolicyV115.poem_89?.current_status!=="strongest-held-reading-resolution")errors.push("WAVE2 HELD POLICY V115 poem89 status drift");
if(wave2HeldPolicyV115.poem_89?.promote_to_wave2_verified!==false)errors.push("WAVE2 HELD POLICY V115 poem89 must remain held");
if(wave2HeldPolicyV115.poem_89?.policy_review?.revised_blocker!=="target-specific-reading-resolution-required")errors.push("WAVE2 HELD POLICY V115 poem89 blocker drift");
if(wave2HeldPolicyV115.poem_94?.current_status!=="hold-strict-orthographic-equivalence")errors.push("WAVE2 HELD POLICY V115 poem94 status drift");
if(wave2HeldPolicyV115.poem_94?.promote_to_strict_wave2_verified!==false)errors.push("WAVE2 HELD POLICY V115 poem94 must not enter strict verified set");
if(wave2HeldPolicyV115.wave2_counts?.verified_snapshot_v039!==14||wave2HeldPolicyV115.wave2_counts?.held_snapshot_v039!==5||wave2HeldPolicyV115.wave2_counts?.current_counts_changed!==false)errors.push("WAVE2 HELD POLICY V115 counts drift");

if(orthographicEquivalenceV116.version!=="1.16")errors.push(`ORTHOGRAPHIC EQ V116 version mismatch: ${orthographicEquivalenceV116.version}`);
if(orthographicEquivalenceV116.mode!=="research-diagnostic-only")errors.push("ORTHOGRAPHIC EQ V116 mode drift");
if(orthographicEquivalenceV116.strict_baseline?.changed!==false)errors.push("ORTHOGRAPHIC EQ V116 must not change strict baseline");
if(orthographicEquivalenceV116.strict_baseline?.wave2_verified_snapshot!==14||orthographicEquivalenceV116.strict_baseline?.wave2_held_snapshot!==5)errors.push("ORTHOGRAPHIC EQ V116 wave2 counts drift");
const v116Positive=(orthographicEquivalenceV116.cases??[]).filter(x=>x.o_wo_diagnostic_palindrome&&!x.strict_palindrome).map(x=>x.source_number);
if(v116Positive.join(",")!=="94")errors.push(`ORTHOGRAPHIC EQ V116 positive diagnostic set drift: ${v116Positive.join(",")}`);
if(orthographicEquivalenceV116.verdict?.strict_promotions!==0||orthographicEquivalenceV116.verdict?.public_generator_effect!=="none")errors.push("ORTHOGRAPHIC EQ V116 must remain diagnostic-only");

if(travelSeriesTopologyV117.version!=="1.17")errors.push(`TRAVEL TOPOLOGY V117 version mismatch: ${travelSeriesTopologyV117.version}`);
if(travelSeriesTopologyV117.travel_candidate_effect?.current_status!=="promising-but-parse-needed")errors.push("TRAVEL TOPOLOGY V117 best candidate status drift");
if(travelSeriesTopologyV117.reverse_candidate_effect?.current_status!=="deep-review-needed")errors.push("TRAVEL TOPOLOGY V117 reverse candidate status drift");
if(travelSeriesTopologyV117.family_verdict?.positive_family_established!==false)errors.push("TRAVEL TOPOLOGY V117 must not establish family");
if(travelSeriesTopologyV117.safety_rule?.id!=="series-phrase-repetition-supports-boundary-not-whole-sentence")errors.push("TRAVEL TOPOLOGY V117 safety rule missing");
if(travelSeriesTopologyV117.safety_rule?.applies_beyond_travel_series!==true)errors.push("TRAVEL TOPOLOGY V117 safety rule must generalize");
const v117phrases=(travelSeriesTopologyV117.exact_or_embedded_repetitions??[]).map(x=>x.phrase);
for(const p of ["くかちとや","やとちかく","なかたひ","まはる","はまも","ひたか"])if(!v117phrases.includes(p))errors.push(`TRAVEL TOPOLOGY V117 phrase missing: ${p}`);

if(travelSeriesScholarlyV118.version!=="1.18")errors.push(`TRAVEL SCHOLARLY V118 version mismatch: ${travelSeriesScholarlyV118.version}`);
if(travelSeriesScholarlyV118.source?.poem_specific_transcription_visible!==true)errors.push("TRAVEL SCHOLARLY V118 must preserve poem-specific transcription evidence");
if(travelSeriesScholarlyV118.source?.direct_jstage_pdf_inspection!==false||travelSeriesScholarlyV118.source?.direct_edo_source_image_inspection!==false)errors.push("TRAVEL SCHOLARLY V118 must not claim PDF/original-image inspection");
if(travelSeriesScholarlyV118.travel_90_93_outer_frame_assessment?.status_after!=="promising-but-parse-needed")errors.push("TRAVEL SCHOLARLY V118 best status drift");
if(travelSeriesScholarlyV118.family_verdict?.positive_family_established!==false||travelSeriesScholarlyV118.family_verdict?.automatic_acceptance!==0)errors.push("TRAVEL SCHOLARLY V118 must not establish/accept family");
if(travelSeriesScholarlyV118.safety_rule?.id!=="poem-specific-series-recurrence-strengthens-local-attestation-not-global-syntax")errors.push("TRAVEL SCHOLARLY V118 safety rule missing");

if(historicalMiningWave3V119.version!=="1.19")errors.push(`WAVE3 V119 version mismatch: ${historicalMiningWave3V119.version}`);
if(historicalMiningWave3V119.baseline_policy?.fixed50_unchanged!==true||historicalMiningWave3V119.baseline_policy?.wave2_v039_unchanged!==true)errors.push("WAVE3 V119 must preserve fixed50/wave2 snapshots");
if(historicalMiningWave3V119.baseline_policy?.wave2_verified_snapshot!==14||historicalMiningWave3V119.baseline_policy?.wave2_held_snapshot!==5)errors.push("WAVE3 V119 wave2 snapshot counts drift");
if(historicalMiningWave3V119.baseline_policy?.wave3_separate_lane!==true||historicalMiningWave3V119.baseline_policy?.public_ui!==false)errors.push("WAVE3 V119 must remain separate research lane");
const v119cases=historicalMiningWave3V119.cases??[];
const v119p120=v119cases.find(x=>x.source_number===120);
const v119p121=v119cases.find(x=>x.source_number===121);
const v119p122=v119cases.find(x=>x.source_number===122);
if(v119p120?.status!=="hold-searchable-transcription-incomplete-or-unclear"||v119p120?.kana_length!==30||v119p120?.strict_palindrome!==false)errors.push("WAVE3 V119 poem120 must remain unrepaired hold");
for(const x of [v119p121,v119p122]){
  if(!x||x.kana_length!==31||x.strict_palindrome!==true)errors.push(`WAVE3 V119 strict candidate drift: ${x?.source_number}`);
  if(!x?.conservative_reading||!isPalindrome(x.conservative_reading))errors.push(`WAVE3 V119 palindrome mismatch: ${x?.source_number}`);
  if(x?.promotion_to_fixed50!==false)errors.push(`WAVE3 V119 must not promote fixed50: ${x?.source_number}`);
}
if(v119p121?.graph_value!=="isolated-new-source")errors.push("WAVE3 V119 poem121 graph value drift");
if(v119p122?.shared_B_review?.global_transferability!==false)errors.push("WAVE3 V119 poem122 raw-B contact must remain non-transferable");
if(historicalMiningWave3V119.summary?.strict_wave3_candidates!==2||historicalMiningWave3V119.summary?.new_positive_family_created!==false||historicalMiningWave3V119.summary?.automatic_acceptance!==0)errors.push("WAVE3 V119 summary drift");

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
console.log(`Wave2 verified samples: ${wave2.verified_count}, held: ${wave2.held_count}`);
console.log(`Manual hybrid reviews: ${hybridCuration.reviews?.length??0}`);
console.log(`Topic-first models: ${topicFirst.topic_hierarchy?.length??0}`);
console.log(`Wave2 source triage: ${(wave2Triage.cases??[]).length} held records, promoted=${wave2Triage.summary?.promoted_to_wave2_verified??"?"}`);
console.log(`Autumn/moon v44 spans: phrases=${autumnMoonSpans.counts?.phrase_instances??0}, pivots=${autumnMoonSpans.counts?.pivot_units??0}, seams=${autumnMoonSpans.counts?.seam_units??0}, edges=${autumnMoonSpans.counts?.edge_units??0}`);
console.log(`Topic-first v45 candidates: ${(topicFirstGate.candidates??[]).length}, seam-complete=${topicFirstGate.summary?.seam_complete_nonblocked??0}`);
console.log(`Autumn/moon v46 microgrammar outputs: ${(autumnMoonMicrogrammar.outputs??[]).length}`);
console.log(`Autumn/moon v47 control outputs: ${(autumnMoonControl.outputs??[]).length}`);
console.log(`Scene gate v48 case studies: ${(sceneGate.case_studies??[]).length}`);
console.log(`Factor scene v49 signatures: ${(factorSceneSignatures.signatures??[]).length}`);
console.log(`Seam review v50 tasks: ${(seamReviewQueue.queue??[]).length}`);
console.log(`Seam evidence v51 findings: ${(seamEvidence.findings??[]).length}`);
console.log(`Source-specific v52 eligible: ${(sourceSpecificLane.eligible??[]).length}`);
console.log(`Hani v53 pivot outputs: ${(haniPivotExchange.outputs??[]).length}`);
console.log(`Pivot survey v54 groups: ${(pivotSurvey.groups??[]).length}`);
console.log(`Mitsu v55 directed swaps: ${(mitsuPivotExchange.outputs??[]).length}`);
console.log(`Semantic-role v56 cases: ${(semanticRoleGate.case_studies??[]).length}`);
console.log(`Pivot pipeline v57: total=${(pivotPipeline.results??[]).length}, deep-review=${pivotPipeline.summary?.reaches_deep_review??0}`);
console.log(`Generator contract v58 operations: ${(generatorContract.supported_operations??[]).length}`);
console.log(`Hybrid-002 v99 verdict: ${hybrid002DeepReview.verdict?.current_status}`);
console.log(`Pivot morphology guard v1.00: candidates=${generatedPivotV100.candidate_count}, blocked=${pivotMorphologyGuard.counts?.blocked_by_normalization_guard}`);
console.log(`Shoju-068 source review v1.01: image=${shoju068SourceReview.decision?.source_image_verified}, transcription=${shoju068SourceReview.decision?.scholarly_transcription_verified}`);
console.log(`B=mata morphology review v1.02: positive=${mataOuterReview.decision?.positive_family}`);
console.log(`Musu moon family v1.03: outputs=${(musuMoonFamily.outputs??[]).length}, best=${musuMoonFamily.summary?.best_novel_candidate}`);
console.log(`Musu moon generator v1.04: candidates=${generatedMusuMoonV104.candidate_count}`);
console.log(`Hybrid-007 syntax v1.05: status=${hybrid007SyntaxV105.verdict?.current_review_status}, third-family=${hybrid007SyntaxV105.verdict?.third_positive_family_established}`);
console.log(`Wave2 travel v1.06: prospects=${(wave2TravelMahaV106.generated_prospects??[]).length}, positive=${wave2TravelMahaV106.summary?.positive_family_established}`);
console.log(`Wave2 repeated-seam v1.07: B=${(wave2RepeatedSeamV107.repeated_B_groups??[]).length}, D=${(wave2RepeatedSeamV107.repeated_D_groups??[]).length}, next=${wave2RepeatedSeamV107.summary?.next_generator_family}`);
console.log(`Wave2 travel generator v1.08: candidates=${generatedWave2TravelV108.candidate_count}`);
console.log(`Wave2 travel syntax v1.09: family=${wave2TravelSyntaxV109.verdict?.travel_family_status}, source90=${wave2TravelSyntaxV109.verdict?.source_90_parse_status}`);
console.log(`Fixed50 operation audit v1.10: min1=${fixed50OperationAuditV110.results?.minimum_distance_counts?.["1"]}, patterns=${fixed50OperationAuditV110.results?.single_factor_findings?.observed_patterns?.join("/")}`);
console.log(`Wave2 graph audit v1.11: wave2-paths=${wave2GraphAuditV111.counts?.novel_paths_involving_wave2_provenance}, new=${wave2GraphAuditV111.counts?.genuinely_new_paths_beyond_v035}`);
console.log(`Yamauchi visible v1.12: travel-transcription=${yamauchiVisibleV112.travel_family_effect?.sources_90_93_poem_specific_scholarly_transcription_confirmed}, p94=${v112p94?.current_hold_class}`);
console.log(`Wave2 travel deep v1.13: best=${wave2TravelDeepV113.family_verdict?.best_novel_status}, established=${wave2TravelDeepV113.family_verdict?.established_positive_family}`);
console.log(`Wave2 travel generator v1.14: candidates=${generatedWave2TravelV114.candidate_count}, best=${v114best?.review_status}`);
console.log(`Wave2 held policy v1.15: p89=${wave2HeldPolicyV115.verdict?.poem_89}, p94=${wave2HeldPolicyV115.verdict?.poem_94}`);
console.log(`Orthographic equivalence v1.16: positives=${v116Positive.join(",")||"none"}, strict-promotions=${orthographicEquivalenceV116.verdict?.strict_promotions}`);
console.log(`Travel topology v1.17: phrases=${(travelSeriesTopologyV117.exact_or_embedded_repetitions??[]).length}, best=${travelSeriesTopologyV117.travel_candidate_effect?.current_status}`);
console.log(`Travel scholarly topology v1.18: verified-repetitions=${(travelSeriesScholarlyV118.verified_series_repetitions??[]).length}, family=${travelSeriesScholarlyV118.family_verdict?.status}`);
console.log(`Wave3 v1.19: strict=${historicalMiningWave3V119.summary?.strict_wave3_candidates}, held=${historicalMiningWave3V119.summary?.held_visible_cases}`);
