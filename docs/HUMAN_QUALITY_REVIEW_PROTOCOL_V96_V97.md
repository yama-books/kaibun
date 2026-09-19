# HUMAN_QUALITY_REVIEW_PROTOCOL_V96_V97

更新日: 2026-09-19

## 目的

公開回文候補の自然さを、既存のlayer・quality・sourceに引きずられず人間が判定するための手順。

モデルによるv0.77/v0.80レビューは診断用であり、最終人間判定の代替にしない。

## Phase 1: blind review v0.96

使用:
- `data/public-quality-human-review-blind-v96.json`

元データ:
- `data/public-quality-benchmark-v79.json`

50件について表示するのは:
- review_id
- display
- canonical_reading

伏せる:
- source_pool
- source_id
- current layer
- japanese_quality
- weirdness
- model-assisted review

### 評価軸

grammar:
- pass
- marginal
- fail

semantic_coherence:
- clear
- strained
- opaque

display_reading_fidelity:
- pass
- hint-needed
- mismatch

productive_value:
- expand
- keep-only
- hold

overall_naturalness:
- 1 broken / opaque
- 2 substantial strain
- 3 odd but works as 怪文
- 4 good Japanese with visible wordplay
- 5 palindrome constraint barely intrudes

confidence:
- low
- medium
- high

## Phase 2: unblind adjudication v0.97

使用:
- `data/public-quality-human-adjudication-v97.json`

blind review完了後にのみ:
- source
- current layer
- current japanese_quality
- weirdness

を確認する。

裁定候補:
- keep-current
- promote-layer
- demote-layer
- hold
- display-fix
- reading-hint
- metadata-only

## 重要原則

1. 回文として巧いことと、日本語として自然なことを分ける。
2. 一例だけ面白くても、productive patternとして増やす価値は別判定にする。
3. 固有名・多読漢字は文法評価とは分離してdisplay-reading fidelityで扱う。
4. model-assisted v0.80はhuman review完了後のみ参照する。
5. v0.76 baselineは上書きしない。
6. v0.79 current benchmarkもreview結果で直接書き換えず、裁定台帳から明示的に変更する。

## CI

validator:
- `scripts/validate-human-quality-review.mjs`

検査:
- blind 50件がv0.79とdisplay/reading一致
- blindにsource/layer/quality/weirdnessが漏れていない
- review欄が未記入状態から始まる
- adjudication ledgerはv0.79 metadataと一致
- adjudicationはpending状態から始まる

## 次段階

人間がv0.96を記入した時点で、
別ファイルとしてレビュー結果を保存し、
v0.97へimportして裁定する。

モデルが先に全50件を埋め直すことはしない。
