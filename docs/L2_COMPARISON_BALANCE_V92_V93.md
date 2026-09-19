# L2_COMPARISON_BALANCE_V92_V93

更新日: 2026-09-19

## 背景

L1の10本比較はrecursive kinshipが44.2%を占めていたためv0.86.1で層化した。
L2は同じ前提で過剰補正せず、現行62候補の集中度を別途監査した。

## v0.92 audit

L2 default comparison pool:
- unique 62
- seed 29
- DNA 11
- reverse pair 8
- seam 11
- bridge 3

最大単一family:
- 同定 13
- 全体の約21.0%
- uniform 10本の期待値 約2.10本

hypergeometric:
- P(同定 >=2) = 67.52%
- P(同定 >=3) = 34.80%
- P(同定 >=4) = 11.95%
- P(同定 >=5) = 2.65%

L1ほどの全面的なfamily偏重ではない。
問題は「旦那、Xなんだ。」が比較画面で固まる場合だけ。

## v0.93 policy

通常:
- uniform without replacement

補正:
- family=同定 を最大2本
- 最初の10本に3本以上含まれた場合だけ超過分を未使用の非同定候補で置換

変更しない:
- 候補inventory
- one-shot生成
- layer
- weirdness
- japanese_quality
- L1 v0.86.1
- L3 uniform比較

## 実装

data:
- data/l2-ten-comparison-audit-v92.json
- data/l2-ten-comparison-policy-v93.json

scripts:
- scripts/validate-l2-ten-comparison-policy.mjs

UI:
- repairL2Comparison()
- tenComparisonItems() のL2分岐
- badge v0.32 / 品質バランス比較

## CI

latest:
- Validate 35438410565 success
- Pages 35438410553 success

validator確認:
- pool 62
- 同定 13
- 非同定 49
- worst-case 10件同定入力でも、10 unique / 同定<=2へ修復可能

## 結論

L2ではfamily別quotaの全面導入は行わない。
比較画面のランダム性を維持しつつ、
唯一目立つ同定familyだけ軽くcapする。
