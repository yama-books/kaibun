# Minimal-operation coverage / wave2 factor-graph audit v1.10–v1.11

更新日: 2026-09-20

## 結論

第三positive familyが増えない理由を、
「まだ安全な交換規則を実装していないから」
と考える根拠は薄くなった。

fixed50の51 hybridを最小編集距離で再分類すると、
1因子だけ変わる38件は:

- A-only: 26
- E-only: 12

だけであり、

- B-only
- C-only
- D-only

は0件だった。

さらにwave2 verified 14首を研究グラフへ追加しても、
minimum-distance-1候補35件は:

- A-only: 24
- E-only: 11

だけ。

したがって、
**低リスク単一因子operationの経験的空間はAとEでほぼ尽きている。**

## v1.10 fixed50 audit

Data:
`data/fixed50-minimal-operation-audit-v110.json`

fixed50 hybrids:
51

minimum distance:
- distance 1: 38
- distance 2: 13
- >2: 0

nearest pattern unique counts:
- A: 26
- E: 12
- A+E: 11
- D+E: 2
- A+B: 2
- B+C: 1

### high-cohesion distance-2

semantic_cohesion=3 で distance-2 は:

- hybrid-021: A+E
- hybrid-022: A+E
- hybrid-023: A+E

すべて秋・月。

つまり、
既確立の autumn/moon family 内で
A-only + E-onlyを合成したもの。

第三familyを生む新operationの証拠ではない。

### fixed50 verdict

- A-only: 既実装
- E-only: 既実装
- B/C/D-only: empirical laneなし
- A+E: 既存低リスクoperationの合成として説明可能
- A+B / B+C / D+E: cross-field / low-cohesion

したがってgenerator contractを増やさない。

## v1.11 fixed50 + wave2 graph

Data:
`data/wave2-factor-graph-expansion-audit-v111.json`

wave2 verified14をfixed baselineへ統合せず、
research graphだけ拡張。

factor graph:
- AB
- BC
- CD
- DE

の各edgeがhistorical sourceでattestedの場合だけpathを作る。

### counts

combined graph novel paths:
90

wave2 provenanceを含む:
48

そのうち:
- v0.35 fixed50 hybridと同じpath: 9
- v0.35にないgenuinely new path: 39

minimum distance:
- 1: 35
- 2: 13
- >2: 0

distance-1:
- A-only: 24
- E-only: 11
- B/C/D-only: 0

distance-2:
- A+E: 12
- D+E: 1
- B+C: 1

## travel 90/93 の位置

title-level narrow sceneで見ると、
新規minimum-distance-1で同一題群になるのは
旅行90/93の2方向A-only swapのみ。

したがって v1.07 の:

**wave2-travel-maha がwave2最優先**

という結論は、
repeated-seamだけでなく
combined factor graph全体でも維持された。

## bottleneck update

以前:
> まだ見つけていない低リスクoperationがあるのではないか

現在:
> fixed50でもfixed50+wave2でも、その証拠はない

現在のbottleneckは:

**source coverage / source confirmation**

へ移った。

第三familyを増やすには:

1. hybrid-007 / travel 90-93 のtarget-poem evidenceを改善する
2. または新しい歴史歌をverified corpusへ追加し、新しいnarrow-scene laneを作る

のどちらかが必要。

## policy

変更なし:
- general-factor-crossover disabled
- fixed50不変
- wave2 pending integration
- B/C/D-only operationを追加しない
- cross-field block operationを追加しない
- public UI変更なし

## 次

operation inventionを停止し、
historically verified corpus expansion / source confirmationへ移る。
