# AUTUMN_MOON_SEAM_EVIDENCE_V51

更新日: 2026-09-19  
研究層: v0.51

## 1. 目的

v0.50 の未分類 seam 3件について、
検索で得た山内論文の転写本文と独立二次転写が
**実際にどこまで支えるか**を記録する。

機械可読版:
- `data/autumn-moon-seam-evidence-v51.json`

重要:
今回も山内論文の原画像/PDF自体は直接確認できていない。
したがって、`source-image-confirmed` にはしない。

## 2. 根拠階層

### 公式書誌
J-STAGE:
- 山内潤三「廻文歌の限界と効用（下）」
- 『密教文化』107号
- DOI: 10.11168/jeb1947.1974.107_1

用途:
書誌同定のみ。

### 山内論文本文の公開テキストミラー
123deta上に山内論文の翻刻部分がテキストとして露出している。

用途:
31 / 38 / 追加109の表記・分節の補助確認。

### 独立二次転写
KOTONOHAの古典回文一覧に31番相当が
漢字交じりで独立再掲される。

用途:
31番の `玉は軒端の葉に繁し` の独立照合。

## 3. B=たま ↔ また

対象:
- shoju-031 同（露）
- hybrid-019

山内転写ミラー:
`やとるつゆ 玉は軒端の 葉にしけし 庭のはきのは またゆつるとや`

独立二次転写:
`宿る露 玉は軒端の葉に繁し 庭の萩の葉 また...`

ここから支持されること:
- B=`たま` は明示的な **玉**
- 直後の `は` は C 側
- reverse(B)=`また` は後半に独立した表面列として現れる

まだ支持されないこと:
- `また` の品詞・語義を全コーパスで一つに固定
- 他作品の B=`また` と同一形態として扱う
- 原画像確認済みという主張

暫定署名:
- forward: 玉
- reverse: また（surface token、機能は全体では未固定）
- confidence: medium-transcription-supported
- transferable: **conditional-source-specific**

v0.36 の B=`また` が blocked であることは変更しない。
**同じ音列でも別sourceの解析署名を統合しない**という原則をここでも守る。

## 4. D=むす ↔ すむ

対象:
- shoju-add-109 嫁娘見月
- hybrid-003 / 007 / 014

山内転写ミラー:
`なかよさの 来つるみそらは むすめよめ すむはらそ見る つきのさ夜かな`

支持されること:
- 題は「嫁娘見月」
- 中央列は `むすめよめ`
- D=`むす` は `むすめ` の内部にある
- reverse(D)=`すむ` は次の句の冒頭列として現れる

まだ支持されないこと:
- reverse `すむ` の漢字・厳密な語彙解析
- 別scene・別sourceへ自由に移植できる汎用性
- 原画像確認

暫定署名:
- forward: むす…（surfaced `むすめ` 内）
- reverse: すむ…（phrase onset、語彙解析未確定）
- confidence: medium-transcription-supported
- transferable: **conditional-source-specific**

この3候補は、中央回廊を shoju-add-109 からそのまま継承する場合に限って、
次のsemantic reviewへ送る余地ができた。
汎用 seam として辞書へ開放はしない。

## 5. D=こた ↔ たこ

対象:
- shoju-038 田毎月
- hybrid-004 / 010 / 015

山内転写ミラー:
`なかきよの きつるみちもと こたしろし 田こともちみる 月のよきかな`

支持されること:
- reverse(D)=`たこ` の冒頭 `た` は明示的な **田**
- `たこ` は「田」＋後続列 `こ...` を跨ぐ境界である

まだ分からないこと:
- forward D=`こた` の正確な形態解析
- `田こ...` 後続部の正確な分節
- seamのtransferability

したがって:
- confidence: partial-transcription-supported
- transferable: **false / hold継続**

ここは「田毎月だから小田だろう」等の推測をしない。

## 6. v0.50からの変化

### source-specific conditionalへ進んだ
- B=`たま`
- D=`むす`

### blocked継続
- D=`こた`

グローバルに fully transferable になった seam:
- **0**

## 7. 設計上の発見

`transferable` は boolean だけでは粗い。

今後少なくとも:
- true
- conditional
- conditional-source-specific
- false

を区別する価値がある。

特に歴史回文では、
同じ2かなでも **どの元歌のどの境界として解析されたか**が重要。

## 8. 次

v0.52では、
source-specific conditional を許す専用レーンを作る。

対象:
- hybrid-003
- hybrid-007
- hybrid-014
- hybrid-019

ただし:
- 「review可能」へ進めるだけ
- natural / correct と判定しない
- D=`こた` 系3件は引き続き blocked

その後、4件を scene compatibility と全文統語の観点で個別レビューする。
