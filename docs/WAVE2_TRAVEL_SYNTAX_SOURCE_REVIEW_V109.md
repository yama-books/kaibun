# Wave2 travel 90/93 source-safe syntax review v1.09

更新日: 2026-09-20

## 結論

旅行90/93は、v1.08 generatorの
`hold-source-confirmation`
を維持する。

ただし、90番については同じ作者・笑寿の別作品
「高野山釈教長歌」に重要な平行句が確認でき、
語彙・句型の蓋然性は上がった。

一方、それは90番そのものの原画像・字形・濁点・分節の証明ではない。

したがって今回の更新は:

- lexical plausibilityを上げる
- source glyph confidenceは上げない
- generator candidate statusは上げない

という形に限定する。

## 1. evidence hierarchy

### Tier A
target poemそのものの:
- source image
- poem-specific scholarly reading / annotation

これだけがpoem-specific glyph/parseを直接確認できる。

90/93では未取得。

### Tier B
same-author exact / near-exact phrase parallel。

語彙・句型の蓋然性は上げられるが、
target poemの字形確認には使わない。

### Tier C
歴史辞書の語彙・活用。

語として成立することだけを支える。

### Tier D
same-collection secondary compilation。

corroborationに限定する。

## 2. source 90

normalized:

`ともかくも / まはるなかたひ / きよくゆく / よきひたかなる / はまもくかもと`

### ともかくも

辞書に立つ副詞。

lexical confidenceは高いが、
target source glyphを確認した意味ではない。

### まはる

歴史的な
`回る / 廻る`
はラ行四段。

旅行文脈と整合しうるが、
target source glyphは未確認。

### なかたひ

ここが今回もっとも重要。

笑寿「高野山釈教長歌」に:

`参るなかたひ`

があり、
解読文では:

`参る長旅`

とされる。

したがって、90番の同一表面fragment
`なかたひ`
について
**「長旅」解釈はsame-author parallelで強く支持される。**

ただし:
- 90番の原画像を見たわけではない
- 90番の該当字形が「長旅」と直接確認されたわけではない

### きよくゆく

`清く行く`
は形態的には作れるが、
今回poem-specificな独立根拠は取れていない。

plausible-unconfirmedのまま。

### よきひたかなる

同じ「高野山釈教長歌」に:

`よき日たかなる`

があり、
解読文では:

`佳き日髙なる`

とされる。

したがって、90番ku4の表面列は
**same-author phrase patternとして強く支持される。**

ここでもtarget poem glyph verificationとは分離する。

### ku5

`はまもくかもと`

はsource-safeな全文分節を確定できない。

浜などへの自動復元は禁止。

### 90番 verdict

`partial-support-with-unresolved-ku5`

## 3. source 93

normalized:

`やとちかく / まはるなりいま / みかきよき / かみまいりなる / はまくかちとや`

### やとちかく

`宿近く`
は文脈的仮説に留める。

source-specific evidenceなし。

### まはるなりいま

`まはる`
自体は歴史語として成立。

ただし:
- `まはる + なり + 今`
- その他の分節

のどれかをtarget poemで確定する資料は未取得。

### みかきよき

`御垣`
は古典語として辞書に立つ。

よって
`御垣 + よき`
はlexically plausible。

しかしtarget poemの漢字・分節は未確認。

### かみまいりなる

`神参り`
は語として成立。

ただし
`神参り + なる`
のtarget poem内での統語は未解決。

### ku5

`はまくかちとや`

未解決。

`はま` を「浜」に自動復元しない。

### 93番 verdict

`partial-lexical-support-with-unresolved-syntax-and-ku5`

## 4. author-parallel guard

新規:

`author-parallel-is-not-source-glyph-evidence`

同一作者の別作品に
exact / near-exact phraseがある場合:

許可:
- lexical plausibilityを上げる
- phrase-pattern plausibilityを上げる
- 原画像確認の優先順位を上げる

禁止:
- target poem glyph verifiedとする
- target kanjiを自動復元する
- target voicingを自動復元する
- それだけでdeep-review-supportedへ昇格する

## 5. novel candidates

- `wave2-travel-090-host-093-outer`
- `wave2-travel-093-host-090-outer`

ともに:

`hold-source-confirmation`

維持。

v1.08 generatorはreopenしない。

## 6. sources

Primary scholarly metadata:

山内潤三
「廻文歌の限界と効用 (下)――高野山釈教長歌を頂点として――」
『密教文化』107号, 1974, pp.1-38.
DOI 10.11168/jeb1947.1974.107_1

J-STAGE:
https://www.jstage.jst.go.jp/browse/jeb1947/1974/107/_contents/-char/ja

Same-author parallel transcription/decoding:

駒澤大学ページ
「高野山釈教長歌」
https://www.komazawa-u.ac.jp/~hagi/kouyasan-syakukyotyoka.htm

Dictionary crosschecks:
- まはる / 回る・廻る
- 長旅
- 御垣
- 神参り

## 7. next

travel familyは、
新しいtarget-poem-specific evidenceが得られない限り
v1.08/v1.09で凍結する。

active researchは別operation / familyへ移す。
