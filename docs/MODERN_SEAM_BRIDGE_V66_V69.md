# MODERN_SEAM_BRIDGE_V66_V69

更新日: 2026-09-19

## 1. 目的

歴史回文研究で得た
- operation-specific validation
- semantic-role gate
- directional compatibility
- negative controls
- trace preservation

を、現代語の怪文回文メーカーへ限定移植する。

歴史短歌そのものは公開候補へ入れない。

## 2. v0.66 semantic-role matrix

ファイル:
- `data/modern-seam-role-matrix-v66.json`

対象:
- seam grammar の既存shell
- frameは `see` と `loan`

新しい語彙は一切発明しない。

### see
「Xを見る」のthemeとして:
- person
- animal
- object
- event
- abstract

を既存recipe実績の範囲で許可。

### loan
「Xに貸した」のrecipientとして:
- person: pass
- animal: semantic pass。ただし公開layerは既存方針に合わせL2
- event: review-needed
- object / abstract: hold

## 3. v0.67 deterministic generator

実装:
- `scripts/generate-modern-seam-bridge.mjs`

fixture:
- `data/generated-modern-seam-bridge-v67.json`

新規候補:
- total 13
- semantic accepted 7
- review-needed 1
- hold-semantic-role 5

CI:
- strict palindrome
- candidate IDs
- status
- fixture drift
- curation一致

## 4. v0.68 human curation

ファイル:
- `data/modern-seam-bridge-curation-v68.json`

人手確認:
- accepted 7
- review-needed 1
- held 5

### accepted例
- タミも庭のワニも見た。
- タミも店のセミも見た。
- タミも今朝の酒も見た。
- 確かに庭のワニに貸した。
- 確かに店のセミに貸した。
- 確かに家のエイに貸した。
- 確かにリスのスリに貸した。

### review-needed
- 確かにイカの会に貸した。

「会」を団体と読めばrecipientになりうるが、
現行shell metadataは `event-noun`。
無断で語義を変えずreview-needed。

### hold
- 確かに今朝の酒に貸した。
- 確かに梨の品に貸した。
- 確かに砂のナスに貸した。
- 確かに嘘の層に貸した。
- 確かに声のエコに貸した。

構造上は完全回文でも、
recipient semantic roleに合わない。

## 5. 既存公開poolとの重複

accepted 7件を
- seed
- generation rule
- reverse pair
- seam recipe

へ照合。

重複:
- 「確かに庭のワニに貸した。」
- reading: `たしかににわのわににかした`

既存:
- seed `V05-0065`
- rule `L1-TASHIKANI-LOAN`

したがって研究上はpositive再発見例として残すが、
public bridgeからは除外。

## 6. v0.69 public whitelist

ファイル:
- `data/modern-bridge-public-v69.json`

真の新規:
- total 6
- L1 3
- L2 3

### L1
- タミも庭のワニも見た。
- タミも店のセミも見た。
- タミも今朝の酒も見た。

### L2
- 確かに店のセミに貸した。
- 確かに家のエイに貸した。
- 確かにリスのスリに貸した。

貸借+animalは、
既存 `L1-TASHIKANI-LOAN` の
「人物ならL1、異常な相手ならL2」
に合わせてL2へ補正した。

## 7. public validator

実装:
- `scripts/validate-modern-bridge-public.mjs`

検査:
- whitelist 6件
- 全件strict palindrome
- v0.68 deduplicated curation一致
- excluded漏れなし
- seed / DNA / reverse pair / seam recipe と重複なし
- L1=3 / L2=3

## 8. UI integration

公開 `index.html`:
- badge: `v0.27 / 研究由来DNA`
- `modern-bridge-public-v69.json` を追加読込
- `bridgePool()` を新設
- 既存 `seamPool()` に合流
- 新ボタンは追加しない
- 「継ぎ目型DNA」から自然に利用
- 10本比較・実効候補数にも反映

既存:
- seed
- DNA
- reverse pair
- growth

は変更しない。

## 9. UI保守

公開前確認で、
JSが更新していた
- `lengthMeta`
- `wrapMeta`

のHTML要素が欠落していることを発見。

2 pillを復元し、
`validate-ui.mjs` に存在検査を追加した。

## 10. 現在の評価

歴史研究が
「古典回文を分析する研究」から
「現代の新規候補を、意味役割で選別して増やす生成原理」
へ実際に接続された。

今回のbridgeで重要なのは候補数6件ではなく、

**完全回文でも意味役割が壊れる5件を自動で落とせた**

こと。

これは怪文回文メーカーの品質向上に直接使える。
