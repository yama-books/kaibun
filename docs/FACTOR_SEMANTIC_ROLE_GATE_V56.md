# FACTOR_SEMANTIC_ROLE_GATE_V56

更新日: 2026-09-19  
研究層: v0.56

## 1. 目的

v0.48 の scene compatibility に続き、
中央E3を交換するときの **意味役割** を見る。

機械可読版:
- `data/factor-semantic-role-gate-v56.json`

ここでも数値自然度スコアは導入しない。

## 2. なぜsceneだけでは足りないか

v0.55では
- 地水火風空
- 釈教

の2首はどちらも broad field = 信仰、
D=`みつ↔つみ` も high / transferable。

それでもE交換の結果は方向で異なった。

理由:
中央句が全文で担う仕事が違うため。

## 3. role vocabulary

### scene-predication
同じ景の中で対象の状態・動作・見え方を述べる。

例:
- `葉にしけし`
- `葉にてりて`

文法形は同じでなくても、
局所sceneを描写する仕事が保たれればよい。

### structural-enumeration
列挙構造の一部を担う。

例:
地水火風空の
`水も火も`

これは単なる水・火語彙ではなく、
五大列挙の骨格。

### relational-description
XのYの、のような関係記述。

例候補:
`みつのよの`

ただしmining層では完全解析を断定しない。

### evaluation
評価・詠嘆・結び。

### temporal-pivot
時間・夜・更けなどの進行をつなぐ。

### unresolved
証拠不足。

## 4. gate

前提:
1. strict palindrome
2. D seamが操作に対して成立
3. scene gate pass または明示レビュー

結果は3状態。

### compatible-by-reviewed-context
文法形式が違っても、
同じ局所的役割を保つことが文脈レビューで確認できる。

### review-needed
sceneは合うが、
host/donorの役割解析がまだ足りない。

### incompatible-for-this-host
donor Eが、
hostの明示的構造を壊す。

重要:
**donor E自体をrejectするのではない。**
hostとの組合せだけを止める。

## 5. case: hybrid-019

host:
- shoju-031
- E=`しけし`

donor:
- E=`てりて`

両者:
- D=`はに`
- 葉・庭scene
- 中央で景を述べる役割

outcome:
`compatible-by-reviewed-context`

## 6. case: hybrid-016

逆方向。

v0.40でsemantic coherence high。

outcome:
`compatible-by-reviewed-context`

## 7. case: hybrid-017

host:
地水火風空

host E:
`もひも` = 水も火も

role:
`structural-enumeration`

donor:
`のよの`

これへ替えると、
地・水・火・風・空の列挙から「火」が抜け、
構造が壊れる。

outcome:
`incompatible-for-this-host`

## 8. case: hybrid-002

host:
shoju-068 釈教

host E:
`のよの`

donor:
`もひも`

sceneは信仰で一致し、
水・火も釈教語彙場から逸脱しにくい。

しかしhost全文の統語はmining層で未確定。

outcome:
`review-needed`

v0.55の
`promising-but-source-parse-needed`
を維持し、機械的には昇格させない。

## 9. 設計原則

- POS一致を要求しない
- scene一致だけでも通さない
- 列挙・対比など明示構造を保護する
- role不足はhold
- source confidence / morphology confidence / role compatibilityを別軸にする
- A→BとB→Aは別判定

## 10. 次

v0.54で作った repeated-D 全交換候補へ、
scene gate と role gate を順に適用する。

目的:
「生成してから大量に読む」のではなく、
**どの段階で何を落としたかが説明できる候補パイプライン**
を作る。
