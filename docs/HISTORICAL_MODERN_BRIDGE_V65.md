# HISTORICAL_MODERN_BRIDGE_V65

更新日: 2026-09-19  
研究層: v0.65

## 1. 目的

歴史回文研究で得た生成原理を、
現代語の「怪文回文メーカー」へ移植する。

機械可読版:
- `data/historical-modern-bridge-contract-v65.json`

重要:
**歴史短歌そのものを公開候補へ流し込まない。**

移植するのは:
- operation-specific validation
- scene gate
- semantic-role gate
- directional compatibility
- negative controls
- candidate trace

## 2. 現行公開generator

公開 `index.html` は候補を次の独立poolから取る。

- seed
- DNA rule
- reverse pair
- seam grammar
- growth
- sentence wrapper

`show()` が必要とする主な公開フィールド:
- display
- reading
- family
- origin
- why
- japanese_quality
- weirdness

研究candidateの重いtraceを
そのままUIへ出す必要はない。

## 3. bridge方式

研究側:
- provenance
- morphology trace
- scene trace
- semantic-role trace
- review status
- cautions

↓ whitelist adapter

公開側:
- display
- reading
- family
- origin
- why
- japanese_quality
- weirdness

一方向変換とする。

## 4. 第一ターゲット

`seam-grammar-v25.json`

理由:
既に
- core
- shell
- particle hinge
- role shift
- boundary shift
を分離して持つ。

歴史研究の
「動かした境界だけ検査する」
という思想と非常に近い。

## 5. 最初のmodern operation

`curated-shell-substitution`

既存recipeをばらして無制限に全組合せするのではない。

1. 同じcore
2. shell role
3. outer predicateが要求するsemantic role
4. scene/participant compatibility
5. strict palindrome
6. human Japanese-quality review

を通す。

## 6. 現在見えるprototype

既存shell:

- garden-croc = 庭のワニ
- shop-cicada = 店のセミ
- house-ray = 家のエイ
- mo-hinge
- ni-hinge
- tami-see
- certain-loan

既存recipeには:
- 確かにこの庭のワニの子に貸した
- 確かにこの店のセミの子に貸した
- タミも家のエイも見た

等がある。

しかしshellの短い組合せとして:

- タミも庭のワニも見た
- タミも店のセミも見た
- 確かに家のエイに貸した

は構造的に生成可能。

これらは
**既存語彙＋既存shellだけ**で作れる。

## 7. semantic-role gate

### 見た frame
`tami-see`

目的語/並列対象:
- person
- animal
- object
- event
- 一部abstract

まで既存recipeで許容されている。

比較的広い。

### 貸した frame
`certain-loan + ni-hinge`

recipientを要求。

安全寄り:
- person
- animal

危険:
- object
- abstract

したがって:
- 家のエイ → candidate
- 梨の品 → hold
のように分ける。

## 8. 公開前の手順

1. modern compatibility matrix作成
2. research scriptで新候補生成
3. existing recipeとの差分だけ抽出
4. positive / negative control固定
5. CI
6. 人手品質レビュー
7. public whitelist
8. index.htmlへ別poolとして接続

この順番を崩さない。

## 9. 現時点の全体進捗

- 歴史研究・生成原理: 約82%
- 怪文回文メーカー全体: 約65%

歴史研究はほぼ設計原理が出揃い、
現在はmodern bridge実装へ重心が移り始めている。
