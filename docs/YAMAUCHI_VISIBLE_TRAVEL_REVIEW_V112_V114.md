# Yamauchi visible transcription / travel deep review v1.12–v1.14

更新日: 2026-09-20

## 1. 今回の最大更新

山内潤三
「廻文歌の限界と効用 (下)――高野山釈教長歌を頂点として――」
『密教文化』107号（1974, pp.1–38）の検索可能な記事再現から、
『廻文歌百首』89〜96番付近の**該当歌転写そのもの**を読める状態になった。

これは従来の
「repositoryに保存したYamauchi-derived normalized string」
より一段強い。

ただし、以下は明確に別レイヤである。

1. 江戸版本そのものの字形
2. 山内1974の学術転写
3. 検索可能な記事mirror/OCRが再現する山内転写
4. 回文判定用normalized reading
5. 辞書・同作者平行例からの語釈仮説

今回直接使えたのは主に3。
**江戸版本の原画像やJ-STAGE PDF本文を直接画像検査したわけではない。**

Data:
- `data/yamauchi-visible-transcription-review-v112.json`

## 2. 90「旅行の人々え」

山内記事転写として読める表面:

- ともかくも
- まはるなかたひ
- きよくゆく
- よき日たかなる
- はまもくかもと

重要:

- target poem自身の表面が確認できた
- `よき日たかなる` の「日」は山内転写で明示
- `なかたひ` は山内転写ではkanaのまま
- ku5 `はまもくかもと` もkanaのまま

同じ笑寿「高野山釈教長歌」の
`参るなかたひ` → `参る長旅`
という平行例は、
`なかたひ = 長旅`
の語釈を強く補強する。

ただし、90番の原版本に「長旅」と書かれていると主張しない。

## 3. 93「旅行（同）」

山内記事転写として読める表面:

- やとちかく
- まはるなり 今
- みかきよき
- 神まいりなる
- はまくかちとや

今回poem-specificに言えること:

- `今` は山内転写で明示
- `神` は山内転写で明示
- `みかき` はkanaのまま
- ku1 / ku5はkana-richで、原字復元は未確定

### 辞書支持のある再分節仮説

#### やとちかく → 宿近く

「宿」は `やど`。

回文用normalized keyでvoicing差が落ちる場合、
`やど` → `やと`
という対応は可能。

ただし **宿** はsource-glyph claimではない。

#### みかき → 御垣

「御垣（みかき）」は、
宮中・神社などの周囲の垣をいう古典語。

直後に山内転写で
`神まいりなる`
があるのでscene上も整合しやすい。

それでも山内転写自身は `みかき` とkanaであり、
原字を「御垣」と確定しない。

#### はまくかちとや

辞書上はそれぞれ:

- 浜（はま）
- 陸地（くがち／くがぢ）
- とや = 格助詞「と」＋係助詞「や」

が成立する。

したがって normalized surface
`はまくかちとや`
について

`浜 + 陸地（くがち） + とや`

という境界ずらし仮説は、
語彙的にはかなりよく成立する。

特に第一句仮説
`宿近く`
のreverse normalized列が
`くかちとや`
側へ再分節できる点は、
回文歌の設計原理として非常に興味深い。

しかし、
**これは辞書支持のある語釈仮説であって、
山内または原版本が「浜陸地とや」と書いているという意味ではない。**

## 4. 89「老賀」

山内記事転写には:

`八十や ...`

が明示される。

「八十」は辞書で `やそ` と読める。

したがってv0.43のcandidate reading:

`やそやおいかないよろこひますとしとすまひころよいなかいおやそや`

がstrict palindromeになるための
「八十=やそ」というreading assumptionは
かなり強くなった。

ただしv0.43は:
`source_image_required_for_promotion=true`

を明示している。

今回はそのpolicyをこっそり緩めないため、
89は:

`hold-by-existing-source-image-promotion-policy`

のまま。

## 5. 94「旅行（同）」

山内記事転写として:

- なかたひも
- ついおそきはる
- 友とちと
- もとるは 木曽を
- いつも 日たかな

が読める。

特に
`木曽を`
の「を」が山内学術転写レイヤで確認できる。

したがってv0.43で
「strict mismatchは お/を のみ」
とされた問題は、
単なるgeneric OCR uncertaintyとは扱わない。

現行分類:

`hold-strict-orthographic-equivalence`

strict-kana corpusでは
お/をを勝手に同一視しない。

これは将来、
historical orthographic equivalence layerを設計する際の
非常に良いcontrolになる。

## 6. travel family v1.13

Data:
- `data/wave2-travel-deep-syntax-review-v113.json`

### direction A

`wave2-travel-090-host-093-outer`

reading:
`やとちかく / まはるなかたひ / きよくゆく / よきひたかなる / はまくかちとや`

重要な変化:

5句すべてが、
source 90または93の山内poem-specific転写で
句単位に実証できる。

- ku1 / ku5 = 93
- ku2 / ku3 / ku4 = 90

かつ両sourceは同じ旅行題群。

さらに93 outer frameには
辞書支持の境界ずらし仮説がある。

したがって旧:
`hold-source-confirmation`

から:

**`promising-but-parse-needed`**

へ一段昇格。

ただしcombined sentence全体の統語は未解決なので
`deep-review-supported`
にはしない。

### direction B

`wave2-travel-093-host-090-outer`

reading:
`ともかくも / まはるなりいま / みかきよき / かみまいりなる / はまもくかもと`

5句のsource attestation自体は同様に改善。

しかし90 ku5
`はまもくかもと`
が依然としてopaque。

よって:
`deep-review-needed`

に留める。

## 7. v1.14 deterministic current fixture

追加:
- `data/generated-wave2-travel-outer-frame-v114.json`

更新:
- `scripts/generate-wave2-travel-outer-frame-research.mjs`

v1.08はhistorical snapshotとして残す。

v1.14 current statuses:

- shoju-next-090 = historical-source
- shoju-next-093 = historical-source
- wave2-travel-090-host-093-outer = promising-but-parse-needed
- wave2-travel-093-host-090-outer = deep-review-needed

禁止:
- accepted
- natural
- deep-review-supported自動付与
- source-image checkedの誤記
- PDF直接確認の誤記

## 8. 現在の第三family競争

確立済み:
1. autumn-night-garden-moon
2. naha-spring-plants

未確立だが強い候補:

### musu-night-sky-family-moon
- hybrid-007
- promising-but-parse-needed

### wave2-travel-maha
- wave2-travel-090-host-093-outer
- promising-but-parse-needed

travel側は今回、
「source confirmation hold」から
「parse review待ち」へ進んだ。

ただし第三positive familyはまだ確定しない。

## 9. 次

1. source 93の `宿近く ↔ 陸地とや` 仮説を、原画像またはpoem-specific語彙分析で検証
2. source 90 ku5 `はまもくかもと` の安全な語彙解析を探索
3. 89はsource-image policyの扱いを別途検討
4. 94はhistorical お/を equivalence layerのcontrolとして保持
5. 新operation追加はv1.10/v1.11監査結果により優先しない
