# MITSU_CENTRAL_PIVOT_EXCHANGE_V55

更新日: 2026-09-19  
研究層: v0.55

## 1. 目的

v0.54で第二の正例候補に選んだ
D=`みつ↔つみ` のE-only交換をレビューする。

機械可読版:
- `data/mitsu-central-pivot-exchange-v55.json`

## 2. 二つの元歌

### 地水火風空
trusted。

- 皆空の
- 世界なり地も
- 水も火も
- 罪も塵無い
- 風の浮く波

意味構造の重要点:
**地・水・火・風・空**という列挙・宇宙観。

### 釈教 68
mining。

山内転写では:
- 品もなく
- ほとけのをしへ
- みつの世の
- つみへしをのけ
- とほくなもなし

source imageは未確認。

両者:
- broad field = 信仰
- D=`みつ`
- reverse D=`つみ`
- D seam = high / transferable

## 3. hybrid-002

host:
- shoju-068 釈教

donor E:
- `もひも` from 地水火風空

出力:
- しなもなく
- ほとけのをしへ
- みつもひも
- つみへしをのけ
- とほくなもなし

v37では B=`ほと` がglobal crossoverでblockedだった。

しかし今回はBを交換していない。
A/B/Cは68番のままなので、
**Bのglobal transferabilityはE-only操作の直接阻害要因ではない。**

暫定:
- promising-but-source-parse-needed

理由:
- sceneは信仰→信仰
- `水も火も` は歴史実証済み
- 五大語彙は釈教世界と矛盾しにくい
- D=`みつ↔つみ` はhigh seam

注意:
- 68番host全体はmining
- source image未確認
- `水も火も` と後続 `罪...` の統語は要確認
- B=`ほと` のglobal ruleは変更しない

## 4. hybrid-017

host:
- 地水火風空

donor E:
- `のよの` from 68番

出力:
- みなくうの
- せかいなりちも
- みつのよの
- つみもちりない
- かせのうくなみ

sceneは信仰のまま。

しかし元歌の:
- 地も
- 水も
- 火も
- 風
- 空

という列挙構造から、
`水も火も` を `水の世の` に替えると、
**五大列挙の意味役割を壊す。**

暫定:
- hold-semantic-role-mismatch

重要:
donor E=`のよの` 自体を否定しているのではない。
このhostで担わせる役割が合わない。

## 5. 新しい発見

E交換は意味的に対称ではない。

同じ:
- broad field
- D seam
- 歴史実証E

を持っていても、

A→B が良ければ B→A も良い

とはならない。

## 6. 必要な新しい軸

scene compatibility の次に:

**factor semantic role compatibility**

が必要。

例:
- enumeration
- action
- description
- evaluation
- temporal pivot
- scene object
- grammatical hinge

E3を交換するとき、
hostの中央部が何の役割を担っているかを壊さないこと。

## 7. 次

v0.56で semantic-role gate を定義する。

ただし数値スコアにはしない。

- compatible
- review-needed
- incompatible-for-this-host

程度の離散判定とし、
missing metadata は hold にする。
