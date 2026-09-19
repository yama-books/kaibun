# RESEARCH_GENERATORS_V59_V60

更新日: 2026-09-19

## 1. v0.59 central-E-swap generator

実装:
- `scripts/generate-central-pivot-research.mjs`

目的:
- repeated-D の E3-only 交換を決定論的に列挙
- v0.57 の12候補と一致確認
- gate traceを候補ごとに保持
- frozen fixture:
  `data/generated-central-pivot-research-v59.json`

CI:
- `node scripts/generate-central-pivot-research.mjs --check`
- GitHub Actionsで成功確認済み

検査:
- candidate IDs
- 31かなstrict palindrome
- 5/7/5/7/7 meter
- final research stage
- gate trace
- frozen reading drift

## 2. v0.60 scene-microgrammar generator

実装:
- `scripts/generate-scene-microgrammar-research.mjs`

対象:
- `data/autumn-moon-microgrammar-v46.json`
- scene: `autumn-night-garden-moon`

生成:
- A 2択 × E 2択 = 4
- historical source: 1
- novel cento: 3

再現対象:
- shoju-035
- hybrid-008
- hybrid-016
- hybrid-022

検査:
- v0.46 output集合と一致
- strict palindrome
- 5/7/5/7/7
- historical/novel件数
- scene trace

CIへ接続済み:
`node scripts/generate-scene-microgrammar-research.mjs --check`

## 3. 現在の研究実装構造

### generator A
central-E-swap
- より一般化可能
- repeated Dを利用
- scene/role gateとnegative controlsを持つ

### generator B
scene-microgrammar
- curated scene family限定
- 安全な中央回廊を固定
- A/Eなど明示された選択肢のみ可変

general-factor-crossover:
- disabled継続

## 4. 進捗目安

### 歴史研究・生成原理
約 **78%**

残り:
- source image精度
- factor role/signature拡張
- 別scene positive family追加
- deep linguistic review

### 怪文回文メーカー全体目標
約 **59%**

残りの大工程:
1. 研究generator CI/fixture完成
2. scene familyを複数化
3. 現代怪文向けへ規則移植
4. 公開generatorへ限定統合
5. 実出力品質評価
6. UI公開・回帰試験

## 5. 次

v0.60 CI成功確認後:
- scene generator fixtureを固定
- 第二scene familyを選定
- 研究generatorの出力形式を共通化
- その後、現代怪文回文メーカーへのbridge設計へ進む
