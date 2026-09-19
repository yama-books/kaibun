# HANI_CENTRAL_PIVOT_EXCHANGE_V53

更新日: 2026-09-19  
研究層: v0.53

## 1. 発見

shoju-031「露」と shoju-035「月」は、どちらも

`D = はに`

を持つ。

- shoju-031: E = `しけし`
- shoju-035: E = `てりて`

この E3 だけを相互交換すると、
既存候補 hybrid-016 と hybrid-019 が得られる。

機械可読版:
- `data/hani-central-pivot-exchange-v53.json`

## 2. 4セル

### shoju-031 元歌
- 宿る露
- 玉は軒端の
- 葉にしけし
- 庭の萩の葉
- またゆつるとや

### hybrid-019
31番の E=`しけし` を
35番の E=`てりて` に交換。

- やとるつゆ
- たまはのきはの
- はにてりて
- にはのはきのは
- またゆつるとや

**変わるのは第三句だけ。**

v0.53暫定研究レビュー:
- promising-but-parse-needed
- semantic coherence: high-tentative

理由:
- 5句中4句は31番の文脈をそのまま保持
- 差し替え句 `葉にてりて` 自体が35番で歴史実証済み
- D=`はに` は共通の high structural seam
- 31番の転写で玉・軒端・葉・庭が表面化し、差し替えも葉＋光のscene内に収まりやすい

注意:
- B=`たま↔また` は source-specific conditional
- `またゆつるとや` の完全な統語・語義は原画像待ち
- 「玉は軒端の／葉に照りて」という接続は研究上有望だが、歴史的原文として存在したとは主張しない

### shoju-035 元歌
- はれつみよ
- きつるもはきの
- はにてりて
- にはのきはもる
- つきよみつれは

### hybrid-016
35番の E=`てりて` を
31番の E=`しけし` に交換。

v0.40:
- promising-but-parse-needed
- semantic coherence: high

## 3. なぜE交換が安全寄りなのか

31かな文法では E3 は中央の ABA。

したがって Eだけを交換しても:
- Aを変えない
- Bを変えない
- Cを変えない
- Dを変えない
- 外側の鏡像構造を変えない

変化は中央3かなに閉じる。

これは v0.46 の A×E 交換よりさらに局所的。

## 4. 生成規則候補

暫定:

> 同じD seamを共有し、D+Eがそれぞれ歴史実証済みで、
> scene互換性がある2つのE3は、
> **中央pivot交換候補**として相互試験してよい。

ただし:
- Dがraw一致だけでは不可
- Dの morphology signature が必要
- Eの意味・統語はレビューが必要
- 生成後の全文レビュー必須

## 5. v0.47との違い

v0.47は外側Aを海・田・家族など異なるsceneから持ち込んだため、
局所接続は保てても全文sceneが崩れた。

v0.53は:
- outer contextを固定
- Dも固定
- central E3だけ交換

なので、scene破壊の範囲が小さい。

## 6. 次

固定50首で複数回出現するDを全調査する。

候補:
- はに
- みな
- みつ
- すす
- けふ

各Dについて:
1. Eの種類
2. source semantic field
3. D signature
4. E交換で作れる未出候補
5. scene互換性

を確認し、
**central-pivot exchange が一般化できるか**を検証する。
