# SOURCE_SPECIFIC_SEAM_REVIEW_LANE_V52

更新日: 2026-09-19  
研究層: v0.52

## 1. 目的

v0.51で `conditional-source-specific` とした seam を、
「その音が同じならどこでも使える」形へ一般化せず、
**元歌の局所回廊を保つ候補だけ**次のsemantic reviewへ送る。

機械可読版:
- `data/source-specific-seam-review-lane-v52.json`

## 2. 原則

source-specific seam を使う条件:

- seam単体が一致するだけでは不可
- seamの左右に接する factor 接続も元歌由来であること
- global seam dictionaryは変更しない
- review可能になるだけで、自然・正解・採用とはしない

## 3. D=むす

証拠元:
- shoju-add-109 嫁娘見月

v0.51:
- `むすめよめ`
- `すむはらそ見る`
- medium-transcription-supported
- conditional-source-specific

必要な局所回廊:
- BC = shoju-add-109
- CD = shoju-add-109
- DE = shoju-add-109

これを満たす:
- hybrid-003
- hybrid-007
- hybrid-014

3件ともAだけが別sourceへ交換され、
中央 B/C/D/E は追加109番の流れを保持している。

したがって3件を:
`semantic-review-eligible-source-specific`
へ進める。

## 4. B=たま

証拠元:
- shoju-031 同（露）

v0.51:
- forward `玉`
- reverse `また` surface token
- medium-transcription-supported
- conditional-source-specific

必要な局所回廊:
- AB = shoju-031
- BC = shoju-031
- CD = shoju-031

hybrid-019 はこの条件を満たす。

DEだけが shoju-035 の `はに+てりて` に変わるが、
B=`たま` 周辺のA/B/Cと、C/D接続は31番を保持する。

したがって hybrid-019 を:
`semantic-review-eligible-source-specific`
へ進める。

## 5. D=こた

対象:
- hybrid-004
- hybrid-010
- hybrid-015

これらも中央回廊自体は shoju-038 を保持する。

しかし v0.51 で解けたのは reverse側の境界だけ。

- reverse `たこ` は `田 + 後続こ...` を跨ぐ
- forward `こた` の形態は未解決

したがって:
**3件ともblocked継続。**

「局所回廊を保つ」だけでは、
未解析seamを安全にすることはできない。

## 6. 数

v0.45で seam-classification-needed:
- 7件

v0.52:
- source-specific semantic reviewへ: **4**
- blocked継続: **3**
- global seamへ昇格: **0**

## 7. 次

次は4件を全文でレビューする。

対象:
- hybrid-003
- hybrid-007
- hybrid-014
- hybrid-019

観点:
1. narrower scene
2. 五句の視点
3. 主体
4. 時間
5. 統語接続
6. 外枠Aを替えたことでsceneが壊れないか
7. source-specific seamが表面に人工的に露出していないか

D=`こた` 3件はレビュー対象に混ぜない。
