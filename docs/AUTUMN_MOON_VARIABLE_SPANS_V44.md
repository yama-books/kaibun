# AUTUMN_MOON_VARIABLE_SPANS_V44

更新日: 2026-09-19  
研究層: v0.44

## 1. 目的

固定50首ベースラインから「秋・月」12首だけを取り出し、
山内式の可変spanを **topic-first生成器で安全に使える辞書**へ変換する。

機械可読版:

- `data/autumn-moon-variable-spans-v44.json`

v0.44 は完成した生成器ではない。
**どの単位なら次段の探索へ渡してよいかを整理する中間層**である。

## 2. 方針

全substringを1〜7かなで列挙する方式は採らない。

優先順位は次の通り。

1. 歴史作で実際に現れた5/7かなの句
2. 既に morphology signature が与えられた2かな seam
3. 31かな構造上の中央3かな ABA pivot
4. 歴史50首で実証された冒頭/末尾の edge reversal

理由:

- 短いかな一致を大量に集めると、意味・語境界・品詞が失われる。
- 歴史作の自然さは、局所的な逆読語よりも句と意味場に強く依存する。
- raw kana 一致だけの交配は v0.36 で既に禁止している。
- 山内式 v0.41 も句レベル実証を短いセルより強く評価する。

## 3. 対象12首

`historical-semantic-fields-v32.json` で broad field = `秋・月` のものだけを使用。

1. shoju-030 露
2. shoju-031 同（露）
3. shoju-033 月
4. shoju-035 同（月）
5. shoju-038 田毎月
6. shoju-040 月明海上鴻鷹渡
7. shoju-041 初鷹
8. shoju-043 名所苅
9. shoju-044 紅葉
10. shoju-045 九月尽
11. shoju-add-109 嫁娘見月
12. shoju-add-111 出来秋

注意:
これらの意味場分類は mining 層では**題を根拠にした暫定分類**。
本文の意味解釈を確定したものではない。

## 4. 辞書件数

- source records: **12**
- 5/7かな phrase instances: **60**
- unique phrase readings: **60**
- central ABA pivot: **11**
- morphology-signed seam: **5**
- attested edge reversal: **8**

wave2 v0.39/v0.43 は含めていない。

## 5. phrase units

12首 × 5句 = 60件をそのまま保存した。

各unitは:

- reading
- span_length
- semantic_field
- provenance
- confidence
- reverse_reading
- 元の句位置
- 鏡像位置
- 鏡像が韻律境界を跨ぐか

を持つ。

### 重要: 句の逆読みは必ずしも句にならない

31かな回文では、韻律境界と鏡像境界が一致しない。

句ごとの鏡像位置:

| 元句 | 位置 | 鏡像位置 | 関係 |
|---|---|---|---|
| 第1句 | 1-5 | 27-31 | 第5句末尾5かな |
| 第2句 | 6-12 | 20-26 | 第4句→第5句を跨ぐ |
| 第3句 | 13-17 | 15-19 | 中央から第4句へ跨ぐ |
| 第4句 | 18-24 | 8-14 | 第2句→第3句を跨ぐ |
| 第5句 | 25-31 | 1-7 | 第1句→第2句を跨ぐ |

したがって、
**「7かな句を逆にしたら別の7かな句になる」ことを要求してはいけない。**

phrase unitを強く評価するのは「その方向で実際に自然な句として使われた」からであって、
reverse側も同じ単位であると仮定するためではない。

## 6. seam units

秋・月12首に実際に含まれ、v0.36で morphology signature があるものだけを採用。

### B2

#### きつ ↔ つき
- confidence: medium
- transferable: conditional
- evidence in autumn/moon:
  - shoju-035
  - shoju-038
  - shoju-040
  - shoju-add-109
- forward: 来つる等を含む可能性
- reverse: 月

反転側「月」は強いが、forward parse が作品ごとに違いうる。
**自動接続は条件付き。**

#### ほと ↔ とほ
- confidence: low-for-crossover
- transferable: false
- evidence:
  - shoju-044

`ほととぎす / ほど / ほとけ` 等の形態差を持つため、
秋題だからという理由でも自動交配しない。

### D2

#### はに ↔ には
- confidence: high
- transferable: true
- evidence:
  - shoju-031
  - shoju-035
- 葉に ↔ 庭

最重要の境界ずらし。

#### けふ ↔ ふけ
- confidence: high
- transferable: true
- evidence:
  - shoju-033
- 今日 ↔ 更け

時間名詞→動詞語幹への役割転換。

#### みな ↔ なみ
- confidence: high
- transferable: true
- evidence:
  - shoju-040
- 皆 ↔ 波

内容語どうしの意味役割転換。

## 7. central pivot

E3は12首から11種類。

- のねの
- しけし
- のよの
- てりて
- しろし
- かりか
- まやま
- しはし
- かきか
- めよめ
- のほの

`かりか` は2首で重複。

すべて構造上ABAだが、
**独立語とは限らない。**

したがって `unit_type=central-ABA-pivot` とし、
`transferable=conditional` に固定した。

## 8. edge reversals

秋・月12首に関係する歴史50首内の実証例:

- なか ↔ かな
- みな ↔ なみ
- やま ↔ まや
- やと ↔ とや
- きつ ↔ つき
- てり ↔ りて
- はれ ↔ れは
- ゆつ ↔ つゆ

これは「端で使われた」実証であり、
詳細な morphology signature が無いものまで自動的に安全とはしない。

## 9. v0.44で意図的に作らなかったもの

- 全1〜7かなsubstring
- 未確認漢字の復元
- phrase内部の推測形態解析
- wave2 14首の統合
- 50→64統計の上書き
- 新作回文の自然さ判定
- 公開UIへの反映

## 10. 次の生成段階

次は v0.44 を使い、
**秋・月の scene template を先に固定した探索**へ進む。

最初の scene 候補:

1. 夜の庭に月が照る
2. 露・萩・葉・庭
3. 田毎の月
4. 海上の月と雁
5. 秋の終わり・風・紅葉

探索時の優先:

1. 五句の意味場が一つ
2. 歴史的5/7かな phrase attestation
3. high seam
4. conditional seam
5. central pivot
6. edge reversal

禁止:

- `ほと` を raw kanaだけで繋ぐ
- proper nameで穴埋め
- 題と無関係な句を音だけで混ぜる
- 句ごとの局所自然さだけで全文自然と判定する

## 11. 現段階の結論

v0.44で、
「可変span」は単なる可変長文字列ではなく、

**歴史上の句 / 形態署名 / 中央pivot / 端の役割転換**

という異なる信頼度の単位を同じ探索グラフへ置く設計になった。

次段ではこの異種nodeを重み付きで組み合わせる。
