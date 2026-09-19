# AUTUMN_MOON_CONTROL_MICROGRAMMAR_V47

更新日: 2026-09-19  
研究層: v0.47

## 1. 目的

v0.46 の成功例だけを見ると、

- broad field = 秋・月
- 五句すべて歴史実証
- B/D seam が安全
- 局所接続 AB/BC/CD/DE が歴史実証

まで揃えば十分に見える。

そこで、同じ条件を満たしながら人手評価が弱かった
**海上月・雁系**を対照familyとして切り出した。

機械可読版:

- `data/autumn-moon-control-microgrammar-v47.json`

## 2. core

元歌:

- shoju-040
- 題: 月明海上鴻鷹渡
- primary field: 秋・月・海・鳥
- tags: 月 / 海 / 鴻雁

固定:

- B = `きつ`
- C = `しもなかの`
- D = `みな`
- E = `かりか`

D=`みな↔なみ` は high / transferable seam。

## 3. Aだけを変える

A候補:

1. `てりつうみ`
   - shoju-040
   - 海・月・鳥
2. `なかきよの`
   - shoju-038 田毎月
   - 月・田
3. `はれつみよ`
   - shoju-035 月
   - 月・秋
4. `なかよさの`
   - shoju-add-109 嫁娘見月
   - 月・家族

4つとも B=`きつ` と組んだ A+B が
それぞれの元歌で実証されている。

中央側 B/C/D/E は shoju-040 のまま。

## 4. 出力

### shoju-040
元歌。

### hybrid-006
A = `なかきよの`

v0.40:
- hold-source-parse
- C+ tentative
- semantic coherence: medium

### hybrid-013
A = `はれつみよ`

v0.40:
- hold-source-parse
- C+
- semantic coherence: medium-high

### hybrid-009
A = `なかよさの`

v0.40:
- reject-for-now
- C
- semantic coherence: medium

新規3件のうち、
strong / promising に入ったものは **0**。

## 5. v0.46との対照

v0.46 夜・庭・萩・月 family:

- novel 3
- strong/promising 3

v0.47 海上月・雁 control family:

- novel 3
- strong/promising 0
- hold 2
- reject 1

両者とも:

- 31かな完全回文
- 五句すべて歴史実証
- 局所factor実証
- B/D seam条件を満たす

それでも人手評価が分かれた。

## 6. 原因候補

v0.47 の外枠 A は、
すべて broad field では `秋・月` に入る。

しかし core shoju-040 のscene-specific tags:

- 海
- 鴻雁

を共有しない。

各Aとの共有は実質 `月` だけ。

したがって、
**broad field一致は意味場ゲートとして粗すぎる**
可能性が高い。

v0.40 の人手レビューとも整合:

- hybrid-006:
  「意味場一致だけで全文自然さを保証できない」
- hybrid-009:
  「音列上の適合が意味上の適合を上回っている」
- hybrid-013:
  中央の解析・外枠との係り受けが未確定

## 7. 新しい仮説

次のtopic-first gateでは、
`broad_field=秋・月` だけでなく
**scene-specific tag overlap** を導入する。

暫定案:

> outer factor を別sourceから持ち込む場合、
> core scene の generic tag「月」以外にも
> 少なくとも1つscene-specific tagを共有するか、
> 人手のsemantic approvalを要求する。

v0.47ではこの規則をまだ強制しない。
提案として保存する。

## 8. 意味

これは失敗familyではなく重要な対照実験。

v0.46が教えるのは
「局所接続を守れば良い候補が作れる」。

v0.47が教えるのは
「局所接続だけでは足りず、sceneの細粒度が必要」。

両方を合わせると、次の生成順は:

1. broad topic
2. narrower scene
3. scene-compatible source pool
4. safe seam corridor
5. attested A/E variation
6. strict palindrome
7. human review

となる。

## 9. 次

v0.48 では、
v0.46 と v0.47 を教師例として
**scene compatibility gate** を明文化する。

目的はスコアを増やすことではなく、
明らかに異なるsceneの組合せを候補生成前に落とすこと。
