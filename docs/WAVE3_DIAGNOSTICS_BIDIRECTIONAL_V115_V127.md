# Wave3 diagnostics / bidirectional research v1.15–v1.27

更新日: 2026-09-20

## 1. 概要

HANDOFF §39以降、研究の主眼を

- operationを増やすこと
- candidate数を増やすこと

から、

**source coverageを増やし、strict / orthographic / morphology / bidirectional の各現象を分離して保存すること**

へ移した。

結論として:

- strict fixed50は変更しない
- wave2 verified14 / held5は変更しない
- third positive familyはまだ確定しない
- wave3には新しいstrict sourceが増えた
- しかし新しいfactor contactは安全ゲートで止まり、positive familyには昇格しなかった
- お/を、へ/え、ゑ/え の歴史表記差は別diagnostic layerとして整理できた
- 123〜130にはstrict palindromeとは別の「一首を二首に読める」bidirectional tanka層があることを機械化した

## 2. v1.15 held evidence policy

`data/wave2-held-evidence-policy-review-v115.json`

89「老賀」:
- 山内転写に `八十`
- `八十=やそ` なら31かなstrict palindrome
- ただし原画像だけでは読みが決まるとは限らない
- palindrome構造から `やそ` を選ぶ循環は禁止

blockerを:

`source-image-required`

から

`target-specific-reading-resolution-required`

へ精密化。

94「旅行（同）」:
- 山内転写で `木曽を` が可読
- strict mismatchは mirrored `お/を` 1組
- generic OCR holdではなく
  `hold-strict-orthographic-equivalence`

## 3. v1.16 / v1.21 / v1.26 お/を diagnostic

初期:
`data/historical-orthographic-equivalence-v116.json`

拡張:
- `data/historical-orthographic-equivalence-v121.json`
- `data/historical-orthographic-equivalence-v126.json`

current positive controls:

1. 94 旅行
2. 110 狸狢ものゝ名
3. 115 東都学長錦字楼の号を給ふかへし
4. 118 老摘草

4首とも:
- 31かな
- strict palindrome = false
- literal mirror mismatch = お/を 1組だけ
- declared o/wo diagnosticではmirror pass

しかし:
- strict promotions = 0
- source stringを書き換えない
- お/を universally interchangeableとは主張しない
- public generator effect = none

negative controls:
- 82
- 88
- 92
- 106

専用validator:
`scripts/validate-historical-orthographic-equivalence.mjs`

## 4. v1.17–v1.18 travel phrase topology

`data/travel-series-phrase-topology-v117.json`
`data/travel-series-scholarly-topology-v118.json`

旅行90/91/93/94でpoem-specific scholarly transcription上の反復を確認:

- `くかちとや`
  - 91 ku1
  - 93 ku5 suffix
- `やとちかく`
  - 93 ku1
  - 91 ku5 suffix
- `なかたひ`
  - 90
  - 94
  - 同作者「高野山釈教長歌」でも長旅解釈
- `まはる`
  - 90 / 91 / 93
- `はまも`
  - 90 / 91
- `日たか`
  - 90 / 91 / 94

これによりtravel familyは、
title-levelだけでなく
**authorial series phrase-bank / topology**
を持つことが分かった。

ただし:

`wave2-travel-090-host-093-outer`

は
`promising-but-parse-needed`
維持。

理由:
local boundary attestationは強くなったが、
recombined whole-sentence syntaxは未注釈。

## 5. v1.19 wave3 start

`data/historical-mining-wave3-v119.json`

120〜122:

### 120 賀
- conservative visible reading = 30かな
- repair禁止
- hold

### 121 不二雪
- 31かな strict
- factors:
  - A=きゆるなよ
  - B=こと
  - C=しふるもつ
  - D=むつ
  - E=のなの
- existing graph factor contactなし
- isolated new source

### 122 むかしくを子らにならひ
- 31かな strict
- B=たま が fixed50 shoju-031 とraw一致
- morphology identity未確認
- scene不一致
- transferability false

## 6. v1.20 wave3 114–119

`data/historical-mining-wave3-expansion-v120.json`

### 114 心経にならひ
- visible conservative reading 29かな
- hold
- symmetry補修禁止

### 115 東都学長錦字楼の号を給ふかへし
- 31かな
- strict false
- お/を 1組のみ
- o/wo diagnostic

### 116 笹
- 31かな strict
- D=きよ
- fixed50 55「春亀」とraw D contact
- wave2 90ともraw D contact

### 117 手習子にならひ
- scholarly transcriptionに `ヱ`
- mirror側に `家` → いえ
- historical-kana preservingではstrict false
- ゑ/え declared diagnosticではpass
- strictへ入れない

### 118 老摘草
- 31かな
- strict false
- お/を 1組のみ
- o/wo diagnostic

### 119 寄山恋
- 31かな strict
- B=つま
- fixed50 72「寄琴恋」とraw B contact
- 両題は `寄○恋` で狭いscene relation

この119↔72は一見かなり有望だったため、
別途 morphology auditへ進めた。

## 7. v1.23 new factor contact audit

`data/wave3-factor-contact-audit-v123.json`

### 116 D=きよ ↔ 55 春亀

116:
`きよきあき`

55:
`きよくさく`

raw D=`きよ` は一致。

両方で形容詞語幹 `きよ-` の可能性があり、
morphology non-equivalenceを即断しない。

しかし Eのsemantic roleが異なる可能性が高い:

- 116: adjective inflection + season noun
- 55: adverbial/predicate continuation

よって:
`hold-semantic-role-and-scene`

positive family = false

### 119 B=つま ↔ 72 寄琴恋

72 山内転写:
`つま 琴 をもて`

独立辞書には:
`つまごと【爪琴／妻琴】`
= 箏の異称 / 琴を爪弾くこと

が立つ。

したがって72側B=`つま` は、
`つまごと`
語内部である可能性が高い。

119:
`つまとしつ見る`

はtarget-specific morphology未解決。

よって:
- raw B equal = true
- title scene relation = strong
- morphology equivalence confirmed = false
- morphology non-equivalence proven = false
- global transferability = false

would-be A-only 2方向はともに:

`hold-source-specific-morphology`

このケースは:
**narrow scene compatibility does not override morphology**
の新negative control。

## 8. v1.22 / v1.27 historical kana casebook

初期:
`data/historical-kana-equivalence-v122.json`

current:
`data/historical-kana-equivalence-casebook-v127.json`

profileを混ぜない:

### he/e
107「田」
- `たへて`
- mirror側 explicit `枝` → reading assumption えた
- mismatch = へ/え 1組
- diagnostic-only

### ye/e
117「手習子にならひ」
- source surface `ヱ`
- mirror側 `家` → いえ
- ゑ/え diagnostic-only

106は:
- お/を
- ひ/い

が同時に残るためどのsingle profileにも入れない。

## 9. v1.24 bidirectional tanka

`data/historical-bidirectional-tanka-v124.json`

山内転写では123〜130を
「一首を弐首によめる」類としてまとめている。

これはstrict self-palindromeとは別。

machine-clear 124〜129について:

- forward 31かな
- reverse 31かな
- forward != reverse
- 両方向とも5/7/5/7/7へ分割可能

clear:
- 124 夕立返し冬枯
- 125 船中納涼返し虫
- 126 月返し梅
- 127 雪返し花
- 128 神祇返し釈教
- 129 恋返し無常

hold:
- 123 repeat-mark resolution
- 130 layout/segmentation

研究上の価値:
- strict positiveではない
- exact character reversalで左右別の語分割・統語が成立する歴史実例
- seam grammarのcontrastive evidenceとして強い

将来:
`bidirectional-tanka research mode`
候補にはなるが、
現public generatorへ接続しない。

## 10. v1.25 追加106/107/110/112/113

`data/historical-mining-wave3-diagnostics-v125.json`

- 106 老花:
  - 31かな
  - お/を + ひ/い
  - multi-issue hold
- 107 田:
  - 31かな
  - へ/え 1組
  - historical-kana diagnostic
- 110 狸狢ものゝ名:
  - `外=と` は独立辞書根拠あり
  - 31かな
  - 残る差はお/を 1組
  - o/wo diagnostic positive control
- 112 達磨忌:
  - visible conservative reading 30かな
  - hold
- 113 閑子鳥:
  - page-break incomplete
  - hold

## 11. CI

main validator current commit:
`5cf956255522a92c9ae7c731a8d068e7047fcf01`

Validate:
- run `35471808274`
- conclusion: **success**

Pages:
- run `35471808270`
- conclusion: **success**

専用historical diagnostic validator current commit:
`3fbde2ef096a5045e602c1a5c527172fe81c1282`

その直前run:
- Validate `35471792948`
- success

current main runでは既存:
- corpus
- central pivot
- naha
- musu
- travel
- orthographic diagnostic
- modern bridge
- quality
- UI

すべて通過。

## 12. 現在地

確立positive:
1. autumn-night-garden-moon
2. naha-spring-plants

未確立strong candidates:
3. musu-night-sky-family-moon
   - hybrid-007
   - promising-but-parse-needed
4. wave2-travel-maha
   - best travel candidate
   - promising-but-parse-needed

wave3新接点:
- 116 D=きよ → negative semantic-role/scene control
- 119 B=つま → negative source-specific morphology control

よって第三positive familyはまだ増やさない。

## 13. 現在の研究判断

安全なoperation不足ではない。

現在の残課題は:

1. strong unresolved candidateのwhole-sentence syntax
2. target-specific morphology / source interpretation
3. 新しいstrict historical sourceから同一scene repeated seamを得ること
4. human review/adjudication

一方で研究原理そのものはかなり飽和しており、
新しい史料を増やしても
guardが適切にnegativeを止めることが確認できている。

## 14. 次

優先:
1. wave3 source expansionを継続し、安全なsame-scene A/E laneを探す
2. 119↔72は新証拠がない限りmorphology holdで凍結
3. 116↔55はsemantic-role/scene holdで凍結
4. travel/musuはtarget-specific syntax evidence待ち
5. bidirectional tankaはstrict corpusと分離したまま、必要ならseam contrastive datasetへ発展
6. v0.96 human review入力があればv0.97 adjudicationへ
