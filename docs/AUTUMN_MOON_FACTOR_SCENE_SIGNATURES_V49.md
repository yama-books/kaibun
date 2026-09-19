# AUTUMN_MOON_FACTOR_SCENE_SIGNATURES_V49

更新日: 2026-09-19  
研究層: v0.49

## 1. 目的

v0.48 で導入した scene compatibility を、source全体の粗いタグではなく
**どの factor / phrase が scene を担っているか**へ落とす。

対象は v0.46 の autumn-night-garden-moon family。

機械可読版:
- `data/autumn-moon-factor-scene-signatures-v49.json`

## 2. 証拠制限

v0.49 で使う根拠は次だけ。

- v0.40 の人手 tentative parse / reasons / cautions
- v0.36 の morphology-signed seam
- v0.34 の構造的 factor reading

行わないこと:
- かな列だけから自由に漢字を復元する
- 原画像を見たことにする
- 未確定の統語を確定扱いする

## 3. scene を担う主要 unit

### A = なかきよの
- tentative: 長き夜の
- role: time
- tag: 夜
- confidence: human-tentative

### BC = きつるもはきの
- tentative: 来つるも萩の
- role: flora
- tag: 萩
- confidence: human-tentative
- 注意: `きつるも` の係り先は未確定

### D = はに
- forward: 葉に
- reverse: 庭（には）
- role: foliage / place
- tags: 葉 / 庭
- confidence: high-structural
- signature: noun+particle -> place-noun

この family で最も強い scene-bearing boundary shift。

### E = てりて
- tentative: 照りて
- role: light/action
- confidence: human-tentative

### E = しけし
- tentative: 繁し
- role: foliage
- confidence: human-tentative
- 注意: 差し替え後の主述関係は未確定

### ku4 = にはのきはもる
- `庭` 部分は D の reverse parse により構造的根拠あり
- 残り `きはもる` の漢字・語義は未確定
- 推測補完しない

### ku5 = つきのよきかな
- tentative: 月の良きかな
- role: celestial / evaluation
- tag: 月

## 4. あえて未解析のまま残したもの

### A = はれつみよ
v0.34 の構造 factor としては存在するが、
v0.49では新しい意味解析を与えない。

### ku5 = つきよみつれは
`月`を含む scene contribution だけを記録し、
全文統語は断定しない。

## 5. family coverage

### hybrid-008
scene coverage:
- time
- flora
- foliage
- place
- light/action
- celestial
- evaluation

v0.40:
- semantic coherence = high
- strong-promising

### hybrid-016
scene coverage:
- flora
- foliage
- place
- celestial

未解決:
- A の意味
- E の正確な統語
- ku5 全体の統語

v0.40:
- semantic coherence = high
- parse-needed

### hybrid-022
scene coverage:
- time
- flora
- foliage
- place
- celestial
- evaluation

未解決:
- E の正確な統語

v0.40:
- semantic coherence = high
- parse-needed

## 6. 研究上の意味

v0.46 が source-level tag だけでは説明しにくかった理由が見えた。

scene continuity は、
「shoju-035 は月題だから」といった大分類だけでなく、

- `なかきよの` の夜
- `きつるもはきの` の萩
- `はに↔には` の葉/庭
- `てりて` の光
- `つきのよきかな` の月

という **factor/phrase単位の役割連鎖**で支えられている。

## 7. 実装原則

scene signature は、次の3状態を区別する。

1. `high-structural`
   - morphology/seamとして強く確認済み
2. `human-tentative`
   - 既存人手レビューで暫定解析済み
3. `unresolved`
   - 構造は分かるが意味を新規に付けない

unresolved を空欄だからという理由でAI補完しない。

## 8. 次

v0.45で残った seam未分類7候補を、
候補そのものではなく **未分類 seam の頻度順**に並べ直す。

現状の主要未分類:
- D=`むす`
- D=`こた`
- B=`たま`

次段では、元歌文脈・題・既存解析をまとめた review queue を作り、
意味を推測せず「どれを一次資料確認すれば候補空間を最も多く解放できるか」を決める。
