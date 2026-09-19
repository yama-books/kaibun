# Bidirectional seam geometry / independent lattice derivation v1.28–v1.29

更新日: 2026-09-20

## 結論

笑寿123〜130の「一首を弐首によめる」群から得た
machine-clear 6例（124〜129）を、
strict palindromeとは別のcontrastive layerとして解析した。

その結果、
既存v0.34の五変数文法:

`A5 | B2 | C5 | D2 | E3 | rev(D)2 | rev(C)5 | rev(B)2 | rev(A)5`

すなわち:

**5 | 2 | 5 | 2 | 3 | 2 | 5 | 2 | 5**

という格子が、
fixed50へのfitとは独立に、
「31かな短歌を前後両方向とも5/7/5/7/7に切る」
という幾何からそのまま導けることが分かった。

これは研究原理上かなり強い収穫。

## v1.28 seam contrast

file:
`data/bidirectional-tanka-seam-contrast-v128.json`

source:
`data/historical-bidirectional-tanka-v124.json`

clear cases:
- 124
- 125
- 126
- 127
- 128
- 129

forward meter boundaries:
`5 / 12 / 17 / 24`

reverse側の5/7/5/7/7境界を
forward coordinateへ戻すと:
`7 / 14 / 19 / 26`

対応する差:
`+2 / +2 / +2 / +2`

つまりbidirectional tankaでは、
前向きの各句境界から2かな後ろに
逆向きの句境界が来る。

ただしこれはmeter geometryであり、
「2かなが必ず単語・形態素」という意味ではない。

strict promotions:
0

public effect:
none

## v1.29 independent derivation

file:
`data/tanka-mirror-lattice-independent-derivation-v129.json`

forward boundaries:
- 5
- 12
- 17
- 24

reverse mapped boundaries:
- 7
- 14
- 19
- 26

両方に0と31を加えてsort:

`0, 5, 7, 12, 14, 17, 19, 24, 26, 31`

隣接差を取ると:

`5, 2, 5, 2, 3, 2, 5, 2, 5`

これはv0.34 formulaと完全一致する。

## なぜ重要か

v0.34では、
fixed50のstrict palindromeを観察して
五変数文法を抽出した。

v1.29では別種の史料、
つまり:

- self-palindromeではない
- exact reverseが別の短歌になる
- 前後両方向で5/7/5/7/7

というbidirectional tankaから、
同じ格子を独立に再導出できた。

したがってこの9-cell latticeは
単なるcorpus fittingではなく、
**31かな短歌の鏡像meterそのものが作る自然な座標系**
と考える根拠が強くなった。

### B / D が2かなになる理由

forward seamとreverse seamの差が2かなだから。

### Eが3かなになる理由

中央付近:
- reverse mapped boundary = 14
- forward boundary = 17

なので中央overlapが3かな。

strict palindromeの場合はさらに:
- 右側cell = 左側cellのreverse
- E = self-reversing ABA

というequality constraintが加わる。

bidirectional distinct-reverseでは
このequality constraintがない。

## generatorへの影響

強化:
- canonical internal coordinateとして9-cell latticeを維持する根拠

変更しない:
- general-factor-crossover disabled
- B/C/D-only operationを追加しない
- morphology gate
- scene gate
- semantic-role gate
- source-confidence gate
- public generator

つまり、
**構造への確信は上がったが、交換自由度は上げない。**

## 次

追加研究の価値は、
格子そのものを変えることではなく、
この格子上のseam cellへ:

- lexical boundary
- morphology
- semantic role
- scene
- source confidence

を正確に付与することへ移る。

bidirectional corpusはそのための
contrastive historical evidenceとして保持する。
