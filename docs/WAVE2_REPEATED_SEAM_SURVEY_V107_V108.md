# Wave2 repeated-seam survey / travel generator v1.07–v1.08

更新日: 2026-09-19

## 目的

HANDOFF §37 の旅行90/93 prospectが、
wave2全体の中で本当に優先すべき新規familyかを再走査し、
その後、候補とhold理由をdeterministic generatorへ固定する。

## v1.07 repeated-seam survey

対象:
- fixed50 five-variable grammar
- wave2 verified 14
- wave2 held 5 は生成対象にしない

fixed50自体は変更しない。

### repeated B

wave2が関与する repeated B は6群:

1. B=せか
   - 地水火風空 / 地水火風空
   - duplicate/parallel
   - noveltyなし

2. B=なか
   - 伊勢参宮 / 伊勢参宮
   - duplicate/parallel
   - noveltyなし

3. B=なみ
   - 水辺梅 / 東西南北
   - cross-scene hold

4. B=きつ
   - fixed autumn/moon 4首 + wave2 大和廻
   - fixed側は既存family
   - wave2追加分は旅行・場所題で、新positiveを作らない

5. B=いつ
   - 鶴 / 待恋 / 無常 / 旅行
   - heterogeneous cross-scene
   - raw B一致だけでは不可

6. B=まは
   - 90「旅行の人々え」
   - 93「旅行（同）」
   - **唯一の新規 same-title-family repeated-B lane**

両sourceは B+C が:
- `まはるなかたひ`
- `まはるなりいま`

で始まる。

したがって raw B=`まは` だけでなく、
forward surface `まはる` まで共有する。

### repeated D

wave2が関与する repeated D は6群:

- D=みな
- D=みつ
- D=いま
- D=きよ
- D=ひと
- D=かわ

しかし:

- `みな`: wave2追加はE noveltyを増やさず、新規E交換は既存cross-sceneに依存
- `みつ`: v1.00-v1.01 morphology collision guard対象
- `いま`: duplicate/parallel
- `きよ`: 春亀 vs 旅行
- `ひと`: 商 vs 無常
- `かわ`: 釈教 vs 寄川恋

で、new same-scene positive laneは出ない。

### 結論

wave2 re-scanで新規性があり、
かつ同じ題群まで一致するのは:

**B=まは / travel 90-93**

だけ。

したがって §37 で旅行90/93を選んだことを
全体走査で追認した。

Data:
- `data/wave2-repeated-seam-survey-v107.json`

## Source access audit

原画像探索も並行して実施。

確認できたルート:

### 国書DB / 大阪大学忍頂寺文庫

- 『風車塵の言の葉』
- BID: `100080596`
- holder call no.: `C-38`
- film call no.: `228-0019-014`
- 画像一覧には View 導線あり

ただし今回も該当画像フレーム自体は直接検査できず。

### 東京都立図書館

- 『廻文歌百首』
- 加07316
- web表示: 画像取得中 / 画像なし

### 大阪公立大学 杉本図書館

CiNii Books:
- 『風車塵の言の葉』
- `911.158//SHO//MORI J-6984`

所蔵確認のみ。
該当丁の画像検査なし。

### 東北大学 狩野文庫

collection catalog:
- `4468 風車塵の言の葉 1 笑寿`

所蔵確認のみ。
該当丁の画像検査なし。

したがって:
- multiple physical-witness routes = yes
- direct source-image inspection = no

v1.06の `hold-source-confirmation` を解除しない。

## v1.08 deterministic generator

追加:
- `data/generated-wave2-travel-outer-frame-v108.json`
- `scripts/generate-wave2-travel-outer-frame-research.mjs`

候補4件:

Historical source members:
1. shoju-next-090
2. shoju-next-093

Novel:
3. wave2-travel-090-host-093-outer
4. wave2-travel-093-host-090-outer

### invariants

- operation = shared-B-outer-frame-swap
- changed slot = A only
- host B/C/D/E fixed
- B = まは
- forward B+C retains host `まはる...`
- reverse B = はま
- reverse B lexeme = unresolved
- global B transferability = not asserted
- strict palindrome
- 5/7/5/7/7
- wave2 remains outside fixed50
- source_image_checked = false
- novel candidates = hold-source-confirmation
- machine positive/accepted status forbidden

### common schema

v0.61 required fieldsを全4件へ付与:
- provenance
- attestation_trace
- morphology_trace
- scene_trace
- semantic_role_trace
- source_confidence_trace
- cautions

novel 2件は:
- scene = pass-title-level-same-travel
- semantic role = review-needed
- source confidence = source-image-needed
- review_status = hold-source-confirmation

## CI

validator:
- v1.07 group counts
- fixed50 / wave2 counts
- B=まは priority
- source image未確認
- v1.08 IDs / count
- strict palindrome
- meter
- reverse B lexeme unresolved
- source-image false
- novel 2件がhold-source-confirmation
- premature positive禁止

workflow専用step:
`node scripts/generate-wave2-travel-outer-frame-research.mjs --check`

Validate run:
- `35444301341`
- head: `fd03db97802d5d5776f4027a4864abdad3bf9c14`
- conclusion: **success**

同runの既存generator / bridge / UI validatorsもsuccess。

## 現在地

確立positive:
1. autumn-night-garden-moon
2. naha-spring-plants

strong unresolved:
3. musu-night-sky-family-moon / hybrid-007
   - promising-but-parse-needed

best wave2 prospect:
4. wave2-travel-maha
   - 2 novel directed swaps
   - both hold-source-confirmation

第三positive familyはまだ増やさない。

## 次

1. travel 90/93の source image / annotated transcription を引き続き探索
2. 画像に到達できない場合は、surface transcription上の全文syntaxを source-safe に深掘り
3. reverse B=はま の漢字復元は不要なまま維持
4. それでもsource confidenceが上がらなければ、このfamilyはgenerator fixtureとして凍結し、別operation/family探索へ移る
