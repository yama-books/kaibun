# CENTRAL_PIVOT_MORPHOLOGY_GUARD_V100

更新日: 2026-09-19  
研究層: v1.00

## 1. 目的

v0.99 の hybrid-002 deep review で見つかった
**normalization collision** を research generator に反映する。

機械可読版:
- `data/central-pivot-morphology-guard-v100.json`

再生成fixture:
- `data/generated-central-pivot-research-v100.json`

## 2. 問題

旧 generator v0.59 は、
v0.34 の正規化済み `sample.D` をそのまま repeated-D group key にしていた。

そのため:

- 『地水火風空』: `みづ`（水）→ palindrome normalization で `みつ`
- 歌68「釈教」: 転写 `みつ`、morphology unresolved

が同じ D=`みつ` node に入った。

これは **回文正規化上の一致** であって、
**形態素同一性の確認**ではない。

## 3. guard

cross-source D を共有するには、normalized kana 一致に加えて
morphology equivalence が必要。

未確認なら:

**hold-before-scene-gate**

とする。

今回 block する directed pair:
- hybrid-002: shoju-068 → shoju-five-elements
- hybrid-017: shoju-five-elements → shoju-068

## 4. candidate universe

旧 v0.59:
- 12 candidate

v1.00 guard後:
- 10 candidate
- morphology collision hold: 2

残る:
- deep-review-supported: 2
  - hybrid-016
  - hybrid-019
- scene mismatch hold: 8

hybrid-017 の role-negative は削除しない。
**旧pipelineの歴史的negative fixture** として v0.56/v0.57/v0.59 に残す。

ただし現在の生成可否では morphology が先に止める。

## 5. 実装方針

`scripts/generate-central-pivot-research.mjs` は現在 v1.00 を生成・検証する。

v0.59 JSON は書き換えず保存する。

つまり:
- 古い研究判断を消さない
- correction overlay を足す
- 実行generatorだけ現在の研究原理へ進める

## 6. 一般化

回文では正規化が強い。

とくに:
- 濁点
- 歴史的仮名遣い
- 表記差
- 読みの簡略化

を吸収すると、
別語が同じ palindrome key に落ちることがある。

したがって crossover graph は:

**palindrome key graph ≠ morphology graph**

として分離する。

正規化keyは構造検査に使い、
交配可否は形態・語義・source parse 側で別に判定する。

## 7. 次

- CI で v1.00 generator / corpus validator を通す
- Route A source-image verification を再試行
- 歌68 D morphology が確定した場合のみ pair reopen を検討
- 次の positive family は guarded universe から探索する
