# HISTORICAL_TOPIC_FIRST_GATE_V45

更新日: 2026-09-19  
研究層: v0.45

## 1. 目的

v0.44 の秋・月可変span辞書を、
既存の v0.38 historical cento 候補へ適用し、
**topic-first の機械ゲートが過去の人手選別と整合するか**を確認する。

機械可読版:

- `data/historical-topic-first-gate-v45.json`

新しい回文候補は生成していない。

## 2. 候補母集団

v0.38 の51候補から、
source_ids がすべて v0.44 の秋・月12首に属するものだけを抽出。

結果:

- 秋・月だけで構成された cento 候補: **17**
- その17件はすべて、五句5/5が v0.44 の phrase unit として実証済み

これは v0.38 の cento 設計と v0.44 の phrase-first 方針が一致しているため。

## 3. 機械ゲート

### Gate 1: topic

全 source_ids が固定50首の「秋・月」12首に属する。

### Gate 2: phrase

五句すべてが v0.44 の `attested-meter-phrase` に存在する。

### Gate 3: seam

B2 と D2 の両方が v0.44 の `morphology-signed-seam` にあり、
かつ `transferable=false` ではない。

注意:
この Gate 3 は「自然な和歌であること」の証明ではない。
**人手で読む価値のある候補を、raw kanaより安全に絞る研究ゲート**である。

## 4. 結果

秋・月17件のうち:

- phrase gate 通過: **17**
- B/D seam complete + nonblocked: **10**
- seam未分類を含む hold: **7**

機械ゲート通過10件:

1. hybrid-005
2. hybrid-006
3. hybrid-008
4. hybrid-009
5. hybrid-011
6. hybrid-013
7. hybrid-016
8. hybrid-021
9. hybrid-022
10. hybrid-023

## 5. 重要な再現結果

上の10件は、
v0.37→v0.40で実際に人手レビューへ回した10件と**完全一致**した。

つまり:

`秋・月 topic`
+
`五句すべて歴史実証`
+
`B/D seam が形態的に分類済みで blocked でない`

という現在の原理だけで、
過去の priority-semantic-review 集合を再現できる。

これは v0.44 が後付けで候補に合わせた単なる索引ではなく、
既存研究の選別構造を説明できることを示す。

## 6. 人手レビューは上書きしない

v0.45 は新しい数値スコアで v0.40 の判断を上書きしない。

過去のレビューをそのまま保持:

### research-priority
- hybrid-008
  - strong-promising
  - naturalness: B+ tentative-classical
  - semantic coherence: high

### parse-priority
- hybrid-016
- hybrid-022

### source-parse-hold
- hybrid-005
- hybrid-006
- hybrid-013

### multi-source-hold
- hybrid-021

### reject-for-now
- hybrid-009
- hybrid-011
- hybrid-023

### seam-classification-needed
v0.40の10件に入らなかった7件:
- hybrid-003
- hybrid-004
- hybrid-007
- hybrid-010
- hybrid-014
- hybrid-015
- hybrid-019

これらは句実証が弱いのではない。
**BまたはDの形態署名が不足している**ため止まっている。

## 7. ここから得られる設計原則

### 7.1 句実証だけでは足りない

17/17 が五句すべて歴史実証済みでも、
人手レビューへ回せるのは10件。

したがって:

`historical phrase attestation ≠ morphological compatibility`

### 7.2 seamは絞り込みに効く

短い2かなは単独では弱いが、
形態署名が付くと候補空間を17→10へ絞れる。

短spanの価値は「語彙量」ではなく
**接続可能性の判定**にある。

### 7.3 人手レビューは最後まで必要

10件の中にも:
- strong
- parse needed
- source hold
- reject

が混在する。

機械ゲートはレビュー対象を作るところまで。
自然さの最終裁定器ではない。

## 8. 次段

v0.40 で有望だった:

- hybrid-008
- hybrid-016
- hybrid-022

を比較すると、
同じ秋月景の中で少数因子だけを差し替えた
**小さな生成ファミリー**として表現できる可能性がある。

次はこの3件と元歌を使い、
「夜・月・萩・葉・庭」を中心とする
topic-first microgrammar を明示する。

これは v0.44 の「辞書」から
実際の「生成規則」へ進む最初の段階になる。
