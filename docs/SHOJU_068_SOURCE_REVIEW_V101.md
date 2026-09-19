# shoju-068 Route A source review v1.01

更新日: 2026-09-19

## 結論

shoju-068「釈教」の D=`みつ` について、原画像・翻刻・語義解釈を分離して再監査した。

現時点の裁定は次の通り。

- 原画像の該当コマ: **今回の実行環境では直接目視できず**
- 山内潤三の学術翻刻: **歌68「釈教」を確認**
- 翻刻上の表記: **`みつの世の`**
- 語義解釈: **「三つ + の + 世」= 仏教の三世（過去・現在・未来）を指す解釈が強く支持される**
- ただし「原画像に漢字 `三つ` とある」とは記録しない
- `shoju-five-elements` の `みづ（水）→みつ` とは morphology node を共有しない
- hybrid-002 / hybrid-017 は **reopen しない**
- v1.00 morphology guard は維持する

## 1. 原画像レイヤ

国文学研究資料館「国書データベース」で次を確認した。

- 書名: 『風車塵の言の葉』
- 書誌ID: `100080596`
- 所蔵一覧上に画像 View 導線あり
- URL: https://kokusho.nijl.ac.jp/biblio/100080596

ただし今回の実行環境からは Mirador / IIIF の該当コマを直接取得できなかった。
したがって **source-image-confirmed には昇格させない**。

東京都立図書館 Digital BookShelf の『廻文歌百首』も確認したが、検索時点では画像なし / 画像取得中表示だった。

## 2. 学術翻刻レイヤ

山内潤三「廻文歌の限界と効用（下）―高野山釈教長歌を頂点として―」を再確認した。

- 『密教文化』107号
- 1974-07-25
- pp.1-38
- DOI: `10.11168/jeb1947.1974.107_1`
- J-STAGE: https://www.jstage.jst.go.jp/browse/jeb1947/1974/107/_contents/-char/ja
- NDL: https://ndlsearch.ndl.go.jp/books/R100000002-I000000022661-i6306517

翻刻凡例は、原文どおりを旨とし、字体のみ現行漢字・平仮名へ改め、仮名遣いの誤用は原則そのまま残す方針を明記している。

歌68は次の形で翻刻される。

> 釈教（68） 品もなく ほとけのをしへ みつの世の つみへしをのけ とほくなもなし

したがって、少なくとも山内翻刻レベルでは D の surface は **`みつ`** であり、`みづ` ではない。

## 3. 語義・morphology レイヤ

新纂浄土宗大辞典「三世」は「三世」を過去・現在・未来の**三つの世**と定義する。

- https://jodoshuzensho.jp/daijiten/index.php/%E4%B8%89%E4%B8%96

歌68には、

- 題が「釈教」
- 直前が「ほとけのをしへ」
- 問題箇所が「みつの世の」

という局所文脈がある。

このため `みつ` は、語義・統語上は **数量表現「三つ」** と読む解釈が強い。

ただし、これは**言語学的解釈**であり、原画像の字形を「三つ」と復元したものではない。
原画像未確認という不確実性は別フィールドに残す。

## 4. normalization collision の最終扱い

比較対象:

### shoju-five-elements

- pre-normalization: `みづ`
- lexeme: 水
- palindrome normalization: `みつ`

### shoju-068

- scholarly transcription surface: `みつ`
- strongly supported interpretation: 三つ
- palindrome normalization: `みつ`

両者は **palindrome key では同じ `みつ`** だが、lexical / morphology identity は異なる。

よって、

> palindrome key graph ≠ morphology graph

を維持する。

## 5. hybrid-002 / hybrid-017

v0.99では「host morphology unresolved」のため
`hold-morphology-normalization-collision` とした。

v1.01では、原画像字形こそ未確認だが、学術翻刻 + 仏教語義により
**水との非同一解釈が強く支持された**。

現在の扱い:

- hybrid-002: `hold-morphology-non-equivalence-supported`
- hybrid-017: `hold-morphology-non-equivalence-supported`
- reopen: false
- current generator candidate count: 10 のまま
- positive: hybrid-016 / hybrid-019 のまま

## 6. 今後

原画像の該当コマへ到達できた場合は、字形だけを追補する。
その結果がどうであっても、回文正規化keyとmorphology identityを同一フィールドへ戻さない。

次の研究工程は、guarded universe での **次positive family探索** とする。
