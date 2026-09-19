# HYBRID_002_DEEP_REVIEW_V99

更新日: 2026-09-19  
研究層: v0.99

## 1. 結論

`hybrid-002` は、v0.55〜v0.58で「promising-but-source-parse-needed」から deep review へ進めていたが、
今回の精査で **semantic-role より前の morphology gate へ差し戻す**。

現在の判定:

**hold-morphology-normalization-collision**

理由は、二つの元歌が持つ D=`みつ` が、
「同じ形態素が同じ読みで現れた」ことをまだ意味しないためである。

機械可読版:
- `data/hybrid-002-deep-review-v99.json`

## 2. 決定的な差

### donor: 『地水火風空』

既存 trusted data では:

- 表示: `水も火も`
- 読み: `みづもひも`
- 回文正規化後: `みつもひも`

したがって donor D は:

- surface / pre-normalization = `みづ`
- morphology = **水**
- palindrome key = `みつ`

### host: 『廻文歌百首』68「釈教」

山内翻刻の既存転写は:

- `品もなく`
- `ほとけのをしへ`
- `みつの世の`
- `つみへしをのけ`
- `とほくなもなし`

ここで host D は転写上 `みつ` だが、
**水であるとは確認されていない。**

「三つの世」等と読む可能性は仏教語彙上ありうるが、
これは現段階では仮説であって確定しない。

## 3. v0.55 のどこが危なかったか

v0.55 は:

- donor D = `みつ`
- host D = `みつ`

を同一 seam とみなし、
v0.36 の `みつ↔つみ` high signature を両方へ適用した。

しかし donor の `みつ` は
**みづ（水）を palindrome normalization した値**である。

一方 host は山内転写自体が `みつ`。

したがって、ここには

**normalization collision**

がある。

正規化後の文字列が同じでも、
正規化前の読み・形態・語義が同じとは限らない。

## 4. v0.59 generator の問題

`scripts/generate-central-pivot-research.mjs` は
v0.34 の `sample.D` だけをキーにして repeated-D group を作る。

v0.34 は palindrome lattice 用に正規化済みなので、

- `水（みづ）→ みつ`
- host の `みつ`

が同じ node に入る。

これは v0.58 の原則:

> raw kana node merge forbidden

と実質的に衝突する。

v0.59 自体は当時の研究履歴として凍結保存する。
ただし今後の generator では、
**正規化かなだけで D node を共有してはならない。**

## 5. hybrid-002 の gate をやり直す

### structural palindrome
pass。

### historical attestation
local phrase の実在は確認済み。
ただし cross-source の D identity は未確認。

### morphology
**hold。**

donor:
- 水
- みづ → 正規化 `みつ`

host:
- 転写 `みつ`
- morphology unresolved

この二つを同一 morphology と扱う根拠がない。

### scene / semantic role
以前は:
- 信仰 scene 一致
- role review-needed

まで進めた。

しかし corrected pipeline では morphology hold が先なので、
現時点では **not reached** とする。

## 6. hybrid-017 への波及

逆方向の `hybrid-017` も同じ D group に依存する。

v0.56 で得た
「五大列挙を壊す」という semantic-role negative は研究上有益なので残す。

ただし corrected pipeline では、
その前に morphology gate で停止するべきである。

つまり negative control の意味は:

- 旧pipelineで role gate の必要性を示した歴史的fixture

として保存し、
現在の生成可否判定では morphology hold を優先する。

## 7. source review について

歌68の source image はまだ未確認。

山内翻刻再掲:
- https://123deta.com/document/zwvjkmgq-%E5%AF%86%E6%95%99%E6%96%87%E5%8C%96No%E5%B1%B1%E5%86%85%E4%B8%89%E5%BB%BB%E6%96%87%E6%AD%8C%E9%99%90%E7%95%8C%E5%8A%B9%E7%94%A8%E4%B8%8B%E9%AB%98%E9%87%8E%E5%B1%B1%E9%87%88%E6%95%99%E9%95%B7%E6%AD%8C%E3%82%92%E9%A0%82%E7%82%B9%E3%81%A8%E3%81%97%E3%81%A6P.html
- NDL書誌: https://ndlsearch.ndl.go.jp/books/R100000002-I000000022661-i6306517

仏教語として「三世」が過去・現在・未来の三つの世を表すこと自体は確認できるが、
それをもって歌68の `みつ` を自動的に「三つ」と確定してはならない。

## 8. 新しい生成原則

central-E-swap の D 同一性は、今後:

1. palindrome normalized key
2. pre-normalization reading
3. morphology / lexical identity
4. source-specific parse

を分離する。

**1 が同じだけでは crossover 不可。**

これは回文生成で特に重要で、
濁点除去・歴史的仮名遣い・表記正規化が
「別の語を同じ node に見せる」ためである。

## 9. 次

1. normalization-aware / source-sensitive D guard を generator に実装
2. Route A で歌68 source-image verification を再試行
3. guard 適用後に repeated-D candidate universe を再計算
4. そのうえで次の positive family を探索する
