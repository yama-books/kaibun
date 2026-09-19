# PUBLIC_BALANCE_AND_GROWTH_DIVERSIFICATION_V81_V91

更新日: 2026-09-19

## 1. v0.81 display-reading fidelity audit

公開候補の漢字表示とcanonical kana readingの曖昧さを監査。

高リスク:
- 高田 = たかた
  - unique 14
  - default 14
- 魚 = うお
  - unique 4
  - default 4

中リスク:
- 主 = ぬし
- 種 = たね
- 井川 = いかわ

問題は回文判定ではなくUX。
回文判定は既にcanonical kana readingを使っており正しい。

## 2. v0.82 explicit reading hints

追加:
- data/public-reading-hints-v82.json
- scripts/validate-public-reading-hints.mjs

高リスク2語だけ公開hint:
- 高田＝たかた
- 魚＝うお

18 unique候補をCIでcoverage検証。

公開UI:
- high-risk候補だけ「読み指定」pill表示
- 本文displayは変更しない
- canonical readingも変更しない

## 3. v0.83 / v0.83.1 kinship repetition audit

当初の粗いsource集計は過大推定だったため、
index.htmlのdnaPool(true)を直接再構成して訂正。

正確値:
- L1 DNA button unique = 451
- recursive kinship reading = 216
- share = 47.9%

growth:
- narrative family 45
- stage 322
- kinship stage 216
- kinship stage share 67.1%

## 4. v0.84 one-shot DNA exposure policy

追加:
- data/dna-kinship-exposure-policy-v84.json
- scripts/validate-dna-kinship-exposure.mjs

L1「DNAで1本生成」:
- natural recursive share 47.9%
- public draw cap 25%

候補は削除しない。
inventory/candidate countも変更しない。

## 5. v0.85 / v0.86.1 ten-item comparison balance

現行10本比較を再構成。

L1 default:
- combined unique 489
- recursive reading 216
- recursive share 44.2%
- uniform 10本では期待値 約4.4本が親族型

v0.86.1 policy:
- seed nonrecursive: 3
- nonrecursive DNA: 3
- recursive kinship: 2
- seam + bridge nonrecursive: 2

reading集合で親族判定するため、
seedに重複しているrecursive readingも2本枠を迂回しない。

実装:
- tenComparisonItems()
- takeRandomUnused()
- shuffleItems()

通常L1比較:
- 10本中 recursive 2本
- 4 mechanismを必ず混在

validator:
- scripts/validate-ten-comparison-balance.mjs

## 6. v0.87.1 non-kinship quote prototype

親族化前のstage 1を核に4系統を生成:
- 馬もナナも舞う。
- 魚もナナも追う。
- ブヨもナナも呼ぶ。
- 種もナナも寝た。

各10段、合計40段。

新語彙・新wrapperは使わない。

v0.87.1では4 familyの第一wrapperも分散:
- say-topic
- narrate-topic
- hear-kuki
- tell-topic

既存18 fixed quote familyの18-way first-wrapper diversityは壊さないため、
新規lane idは report-simple-* とした。

## 7. v0.88 quote curation

40段中:
- depth 0-5: 24段 accepted候補
- depth 6-9: 16段 held

held理由:
- 全て japanese_quality C
- weirdness 5
- 非親族化のために別種の深い報告stackを増やすのは逆効果

C段は研究fixtureに保持し、公開growthへは入れない。

## 8. v0.89 non-kinship reaction prototype

同じ4つの親族化前核へ既存reaction wrapperを適用:
- react-cry
- react-troubled
- react-silent
- react-laugh

各5段、合計20段。

既存 reaction-light と同じwrapper chainを使用。
元文は reaction-light より短く単純。

validator:
- scripts/generate-nonkinship-reaction-expansion.mjs

## 9. v0.90 public growth rollout

追加:
- data/nonkinship-growth-rollout-v90.json
- scripts/validate-nonkinship-growth-rollout.mjs

公開追加:
- report-simple-* 4 family × 6 stage = 24
- reaction-simple-* 4 family × 5 stage = 20

合計:
- +8 family
- +44 stage

growth-engine:
- version 0.31
- narrative family 45 -> 53
- narrative stage 322 -> 366
- L1 family 13
- L2 family 40
- 引用・伝聞 18 -> 22
- 反応 3 -> 7

親族stage:
- 216のまま

親族比率:
- 216 / 322 = 67.1%
- 216 / 366 = 59.0%

既存45 familyは削除・変更なし。

legacy fixed quote:
- family count 18維持
- first-wrapper diversity 18維持

## 10. v0.91 post-rollout role-gate simulation

growth 53 familyへ再シミュレーション。

結果:
- family count 53
- changed top5 42
- minimum gated pool 8
- declarative ask top5 = 0
- non-quote specialized top5 = 0

新規8 familyでもsemantic-role gateが維持される。

fixture:
- data/growth-wrapper-role-simulation-v91.json

## 11. CI status

最終:
- Validate run 35438220984: success
- Pages run 35438220963: success

主要validator:
- corpus
- historical generators
- modern bridge
- public bridge
- growth role gate v91
- quality benchmark
- reading hints
- DNA kinship exposure
- ten-item comparison balance
- non-kinship quote prototype
- non-kinship reaction prototype
- non-kinship public rollout
- UI

すべてgreen。

## 12. 現在の意味

親族テンプレート偏重に対して、同じ手段を一律に使わず、

1. one-shot DNA: 抽選cap 25%
2. 10本比較: 2/10へ層化
3. growth: 非親族long-tailを44段追加

と、surfaceごとに別の制御を行った。

これにより候補資産を捨てずに、
見える生成結果のsemantic diversityを改善した。

## 13. 次の候補

優先度高:
1. 固定50件quality benchmarkの最終人間判定用フォーマット
2. L2の10本比較もsource-family偏重がないか監査
3. reading hintの中リスク語を実利用で表示すべきか再判定
4. growth 53 familyの選択UIでfamily数増加が操作性を落としていないか点検

研究側:
5. hybrid-002 deep review
6. Route A source-image verification再試行
7. historical fixed50 / wave2 14+5は変更しない
