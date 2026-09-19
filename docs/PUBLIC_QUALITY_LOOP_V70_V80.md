# PUBLIC_QUALITY_LOOP_V70_V80

更新日: 2026-09-19

## 1. v0.70 bridge露出制御

公開bridge 6件の継ぎ目型DNA内での自然露出率を測定した。

標準設定:
- L1: 3 / 22 = 約13.6%
- L2: 3 / 13 = 約23.1%

L2では新規familyが強く出すぎるため、
一発生成時のみ bridge probability cap = 15% とした。

候補一覧・10本比較・実効候補数からは除外しない。

ファイル:
- data/public-bridge-exposure-policy-v70.json

## 2. v0.71 growth wrapper audit

45 narrative familyの終端に対し、
現行noun-collision filter後のauto_priority上位5を監査。

一般sceneではほぼ常に:
- say-topic
- hear-topic
- state-topic
- ask-topic
- narrate-topic

となっていた。

ask-topicは45 family中30 familyのtop5に入り、
内側が宣言文でもpriorityだけで選ばれていた。

ファイル:
- data/growth-wrapper-audit-v71.json

## 3. v0.72 semantic-role gate

自動wrapper選択に保守的role gateを設計。

主ルール:
- ask: 疑問表現がある場合のみ
- decide: 決定語彙がある場合のみ
- cause: 理由scene
- record-identity: 状況scene
- read/write/ack/tell/reply: 引用・伝聞scene
- reaction: 反応または引用・伝聞scene
- general report/cognition: fallback可

手動選択は制限しない。

ファイル:
- data/growth-wrapper-role-gate-v72.json

## 4. v0.73 simulation

45 familyへ決定論的シミュレーション。

結果:
- family: 45
- top5 changed: 34
- minimum eligible pool: 8
- declarative ask top5: 0
- non-quote specialized wrapper top5: 0

fixture:
- data/growth-wrapper-role-simulation-v73.json
script:
- scripts/simulate-growth-wrapper-role-gate.mjs

## 5. v0.74 public rollout

自動選択のみrole gate適用を承認。

既存wrapper quality labelを比較用にだけ数値化したところ:
- current top5 average: 3.5422
- gated top5 average: 3.6667

weirdness floor:
- current: 3.0711
- gated: 3.0533

低品質wrapperへの置換は見られなかった。

ファイル:
- data/growth-wrapper-role-public-v74.json

公開index.html:
- v0.28 / 研究由来DNA＋意味役割外枠
- manual pool = noun collisionのみ
- auto pool = noun collision + semantic-role gate
- auto poolが空ならnoun-safeへfallback

## 6. v0.75 quality metadata audit

公開one-shot poolをmaterializeして重複除去。

全体:
- unique 649
- palindrome failures 0

default:
- unique 635
- L1 492
- L2 60
- L3 83
- palindrome failures 0

ただし重大な限界:
DNA側の japanese_quality は主にlayerから自動付与されるため、
L1=A比率を自然さ成功率として使えない。

ファイル:
- data/public-quality-metadata-audit-v75.json

## 7. v0.76 fixed benchmark

source/layer層化で50件を固定抽出。

L1 25:
- seed 6
- DNA 8
- pair 4
- seam 4
- bridge 3

L2 21:
- seed 6
- DNA 4
- pair 4
- seam 4
- bridge 3

L3 4:
- seed 4

ファイル:
- data/public-quality-benchmark-v76.json

v0.76は改善前baselineとして永久保存。

## 8. v0.77 model-assisted pre-review

最終人間判定ではなく診断用一次レビュー。

結果:
- keep 47
- review 2
- hold 1

主要問題:
- QB-021: タミも今朝のキキの酒も見た。
  - L1には強引
- QB-042: タミも声のエコも見た。
  - semantic mismatchが重なる

ファイル:
- data/public-quality-first-pass-v77.json

## 9. v0.78 calibration

既存データ間の整合を根拠にfamily単位で補正。

time-observation growth側では同構造がすでにL2だったため:
- time-see-nana-child -> L2 / A- / weird4
- time-see-ishii -> L2 / A- / weird3
- time-see-kiki -> L2 / A- / weird3

voice-eco:
- see-voice-eco -> L2 / B / weird4
- 削除せずdefault L2からだけ外す

seam file internal version:
- 0.28.1

action plan:
- data/public-quality-action-plan-v78.json

## 10. v0.79 post-calibration benchmark

v0.76と同じquota・stable hashで再抽出。

baselineから外れた:
- タミも今朝のキキの酒も見た。
- タミも声のエコも見た。

新規:
- 井川もこのナナの子も若い。
- タミも今朝の石井の酒も見た。

ファイル:
- data/public-quality-benchmark-v79.json

## 11. v0.80 post-review

48件はreadingでv0.77評価を継承し、
新規2件だけ再レビュー。

結果:
- keep 49
- review 1
- hold 0

baseline比:
- keep +2
- review -1
- hold -1

注意:
これはmodel-assisted diagnosticであり、
人間の自然さ実験ではない。

ファイル:
- data/public-quality-post-review-v80.json

## 12. 現在の意味

研究成果は現在、
1. 新規候補の生成
2. semantic-roleによる不適合候補の除外
3. public露出制御
4. 長文化wrapperの意味役割選択
5. 固定benchmarkによる品質校正

まで一つの閉ループになった。

次の品質課題:
- 漢字displayとnormalized readingの曖昧さ
- kinship templateの反復率
- 人間による固定benchmark最終判定
