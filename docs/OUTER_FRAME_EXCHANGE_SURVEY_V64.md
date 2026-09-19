# OUTER_FRAME_EXCHANGE_SURVEY_V64

更新日: 2026-09-19  
研究層: v0.64

## 1. 目的

固定50首の repeated-B を使い、
A5だけを交換する shared-B outer-frame swap を全体調査する。

機械可読版:
- `data/outer-frame-exchange-survey-v64.json`

## 2. 操作

変更:
- Aのみ

固定:
- B/C/D/E

回文構造上、
Aを替えると:
- ku1 = donor A
- ku5 = reverse(B) + reverse(donor A)

となる。

したがってこれは
**第1句・第5句外枠の交換**。

中3句はhostのまま。

## 3. repeated B

### なは ↔ はな
- confidence: high
- transferable: true
- 3 source
- 6 directed swaps

trusted春2首:
- 野遊
- 作並

v0.62:
- hybrid-018: deep-review-supported
- hybrid-020: hold-semantic-role-mismatch

残り4件は「士」とのcross-sceneでhold。

現在最良のouter-frame family。

### また ↔ たま
- confidence: low-for-crossover
- global transferable: false
- 2 source
- 2 directed swaps
- 両方 春・草木

ただしA-only操作では:
- host B+Cはhostのまま
- donor外枠はdonorのまま

なので、一般factor-crossoverとは条件が違う。

結論:
- global seam昇格はしない
- `source-specific-review-needed`
- source parse前にpositive扱いしない

対象:
- hybrid-001
- hybrid-012

### ほと ↔ とほ
- 3 source
- 6 directed swaps
- morphology ambiguous
- 全交換が 夏・鳥 / 秋・紅葉 / 釈教 のcross-scene

scene gateで先にhold。
一般crossover禁止も維持。

### きつ ↔ つき
- 4 source
- 12 directed swaps
- 全て broad field = 秋・月
- B seam = conditional
- reverse側の月は安定

代表:

#### hybrid-008
host 35 + outer 38
- v0.40 strong-promising

#### hybrid-005
host 35 + outer 40
- hold-source-parse
- 海外枠 / 庭内部の視点差

#### hybrid-011
host 35 + outer 109
- reject-for-now
- 月という大分類だけでは意味場不足

したがって:
**outer-frame構造が正しくてもnarrow scene gateが必要。**

## 4. 件数

- repeated B groups: 4
- directed swaps: 26

分類:
- high stable positive group: 1（なは）
- conditional / scene-dependent: 1（きつ）
- source-specific review: 1（また）
- cross-scene/morphology hold: 1（ほと）

## 5. 操作固有の重要原則

一般factor-crossoverの
「Bがglobal transferableでなければ禁止」
を、そのままA-only操作へ適用しない。

見るべきなのは
**どの接続を実際に動かしたか**。

ただし:
- source-dependent morphology
- scene
- semantic role

は別に追跡する。

## 6. 現在のpositive family

`naha-spring-plants`

- data: v0.62
- generator: v0.63
- fixtureあり
- CIあり
- common candidate schema対応

positive:
- hybrid-018

control:
- hybrid-020

## 7. 次

公開generatorへ直接入れる前に、
現行のmodern怪文生成構造へ
historical research layerのどの原理を移植するかを設計する。

移植対象候補:
- operation-specific boundary rules
- scene coherence
- semantic-role trace
- negative-control regression
- constrained swap

移植しない:
- historical dictionそのもの
- 史料の漢字復元
- 31かな短歌meterの強制
