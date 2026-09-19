# hybrid-007 syntax deep review v1.05

更新日: 2026-09-19

## 結論

hybrid-007 は第三positive familyの最有力候補のまま保持するが、
**`deep-review-supported` へは昇格しない。**

現行status:
`promising-but-parse-needed`

対象:
`なかきよの / きつるみそらは / むすめよめ / すむはらそみる / つきのよきかな`

残る問題は、
1. `来つるみそらは`
2. `すむはらそ見る`

のsource-specific syntaxである。

## 1. 「来つるみそらは」

外部文法資料では、完了助動詞「つ」の連体形は `つる` で、
連用形へ接続する。
したがって `来 + つる` という形態分析自体は可能。

また `みそら / 御空` は辞書に立つ語である。

しかし、

`来つる + 御空 + は`

という切り方がこの歌のsource-specificな統語・意味として自然であることを
直接支持する原画像、校訂注、独立語釈は今回得られなかった。

よって:
- morphology = formally possible
- syntax/semantics = unresolved
- promotion = no

## 2. 「すむはらそ見る」

`すむ` はkanaだけでは
- 住む
- 澄む

を一意に決められない。
和歌では「澄む」と「住む」の掛詞的利用も知られるため、
文脈が月を含むことだけでどちらかへ固定しない。

さらに、repositoryのYamauchi-derived transcription surfaceは
**`そ`** であり、`ぞ` ではない。

もし `ぞ` なら係り結びを考えられるが、
「その方が文法的にきれいだから」という理由で
`そ → ぞ` と補正するのは循環的。

また `見る` は上一段で終止形・連体形が同形なので、
表面の `見る` だけから `ぞ` の存在を逆算することもできない。

よって:
- lexeme = ambiguous
- voicing = unresolved
- syntax = unresolved
- promotion = no

## 3. 新しい安全規則

`source-voicing-and-lexeme-ambiguity-guard`

次を分離して保持する。

1. source glyph
2. scholarly transcription surface
3. normalized palindrome reading
4. voicing hypothesis
5. lexeme hypothesis
6. syntax hypothesis

**より自然な統語になるという理由だけで、濁点・漢字・語彙・係り結びを復元しない。**

この規則はhybrid-007だけでなく、historical crossover全体へ適用する。

## 4. 史料状態

山内潤三
「廻文歌の限界と効用（下）―高野山釈教長歌を頂点として―」
『密教文化』107号、1974、pp.1-38。

J-STAGE公式号ページでは論文PDF公開を確認したが、
今回の実行環境ではPDF本文を直接画像として検査していない。

したがって:
- article metadata = official verified
- repository transcription = Yamauchi-derived
- source image = not inspected
- image-derived kanji restoration = none

## 5. family verdict

`musu-night-sky-family-moon`:
- best novel: hybrid-007
- third_positive_family_established: false
- automatic acceptance: false
- status: candidate remains open

新しい一次資料または独立したannotated transcriptionが得られるまで、
active searchは別familyへ移す。
