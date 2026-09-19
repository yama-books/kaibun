# Wave2 travel B=まは outer-frame prospect v1.06

更新日: 2026-09-19

## 結論

wave2 verified 14首のうち、旅行題の

- 90「旅行の人々え」
- 93「旅行（同）」

は B2=`まは` を共有し、両方とも B+C が **`まはる…`** と続く。

このため、raw 2-kana一致だけの候補よりは形態上の根拠が強い。

ただし、
- wave2はfixed50へ統合しない
- 原画像未確認
- reverse(B)=`はま` の語彙復元未確認
- 全文の統語・semantic role未確認

なので、第三positive familyとしては昇格しない。

現時点では **wave2 research prospect** として固定する。

## 1. source 90

`shoju-next-090`
題: 旅行の人々え

reading:
`ともかくもまはるなかたひきよくゆくよきひたかなるはまもくかもと`

five-variable:
- A = ともかくも
- B = まは
- C = るなかたひ
- D = きよ
- E = くゆく

meter:
- ともかくも
- まはるなかたひ
- きよくゆく
- よきひたかなる
- はまもくかもと

## 2. source 93

`shoju-next-093`
題: 旅行（同）

reading:
`やとちかくまはるなりいまみかきよきかみまいりなるはまくかちとや`

five-variable:
- A = やとちかく
- B = まは
- C = るなりいま
- D = みか
- E = きよき

meter:
- やとちかく
- まはるなりいま
- みかきよき
- かみまいりなる
- はまくかちとや

## 3. B=まは の評価

両sourceの forward B+C は:

- 90: `まはるなかたひ`
- 93: `まはるなりいま`

で、共通して `まはる` が表面上成立する。

精選版日本国語大辞典の「回る」には歴史的仮名遣い
`まはる`
が立項され、ラ行四段活用として記載される。

ここから安全に言えることは:

- `まはる` は歴史語として成立する
- 両sourceで B=`まは` の直後が `る`
- よって forward B morphology compatibility は raw-B-only より強い

ただし、
**原画像で「廻る」「回る」等と書かれていることを確認したわけではない。**

## 4. reverse(B)=はま を復元しない

A-only outer-frame swapでは、

- host B/C/D/Eは固定
- donor Aを移す
- mirrored ku5 outer frameは donorの `reverse(B)+reverse(A)` と同じ

となる。

つまり、生成後の第五句外枠はdonor側で既に実証された音列になる。

したがって `はま` を
- 浜
- その他の語

のどれかへ今決めなくても、operationの局所実証は保持できる。

**「旅行だから浜だろう」と補わない。**

## 5. novel prospects

### 90 host ← 93 outer

`やとちかく / まはるなかたひ / きよくゆく / よきひたかなる / はまくかちとや`

status:
`hold-source-confirmation`

### 93 host ← 90 outer

`ともかくも / まはるなりいま / みかきよき / かみまいりなる / はまもくかもと`

status:
`hold-source-confirmation`

両方とも:
- strict palindrome: pass
- local overlap attestation: pass
- B morphology: conditional operation-specific pass
- title-level scene: 旅行で一致
- semantic role: review-needed
- source confidence: hold

## 6. 研究上の意味

今回のprospectはpositive数を増やすためのものではない。

重要なのは:

1. raw cell一致より B+C surface continuationを重く見る
2. operationが保持するsource-local contextを評価する
3. donor outer frameが丸ごと保たれるなら、reverse seamを無理に漢字復元しない
4. wave2を研究候補に使ってもfixed50 baselineへ自動統合しない

という設計原則を確認できたこと。

Data:
`data/wave2-travel-maha-outer-frame-prospect-v106.json`

## 次

source 90 / 93 の原画像またはより明示的な学術転写・語釈が得られれば、
A-only familyとして再評価する。

それまではpublic generatorへ接続しない。
