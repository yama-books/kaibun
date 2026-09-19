# NAHA_OUTER_FRAME_EXCHANGE_V62

更新日: 2026-09-19  
研究層: v0.62

## 1. 第二positive family候補

固定50首の repeated-B を調べたところ、
春・草木の trusted 2首:

- shoju-wakakusa「野遊」
- sendai-sakunami「作並」

が B=`なは` を共有する。

v0.36:
- forward: 名は
- reverse: 花
- confidence: high
- transferable: true

この2首で A5 だけを交換すると、
第1句と第5句の「外枠」がセットで交換され、
中3句は host のまま残る。

機械可読版:
- `data/naha-outer-frame-exchange-v62.json`

## 2. 元歌

### 野遊
若草の  
名は知らず見る  
友どちと  
戻る身すらし  
花の咲く川

trusted / source confidence B。

元データの注記では:
- 若草・花・川・友の野遊scene
- 見る／戻るの動作連続

### 作並
みな草の  
名は百としれ  
薬なり  
すぐれし徳は  
花の作並

trusted / source confidence A。

元データの注記では:
- 薬・徳を積み上げ
- 最後に地名「作並」へ着地

## 3. 操作

固定:
- B/C/D/E = host

交換:
- Aのみ

ただし回文では、
Aの交換によって mirror側の第5句末尾も変わる。

したがって実質的には:

**host中3句 + donorの第1/第5句外枠**

となる。

## 4. hybrid-018

host:
- 野遊

outer frame donor:
- 作並

出力:

みな草の  
名は知らず見る  
友どちと  
戻る身すらし  
花の作並

暫定研究レビュー:
- promising-but-linguistic-review-needed
- semantic coherence: medium-high tentative

良い点:
- 両sourceがtrusted
- 春・草木で一致
- B=`なは↔はな` はhigh
- 野遊の「見る／友／戻る」という中3句を保つ
- 外枠も草・花・場所でsceneを壊しにくい
- `みな草の／名は知らず見る` は意味的に成立しうる

注意:
- `戻る身すらし／花の作並` の古典語統語は追加レビュー必要
- 歴史的実在歌ではなく新規cento

## 5. hybrid-020

host:
- 作並

outer frame donor:
- 野遊

出力:

若草の  
名は百としれ  
薬なり  
すぐれし徳は  
花の咲く川

暫定:
- hold-semantic-role-mismatch

理由:
作並hostの中3句は
「名→薬→徳」と積み上げ、
元歌では結句の地名「作並」へ着地する。

外枠を野遊へ替えると、
`すぐれし徳は／花の咲く川`
となり、
medicine/virtue statement の着地点が弱くなる。

重要:
- broad scene は同じ
- morphology も安全
- それでも方向差が出る

これは v0.55 の `みつ` と同じく、
**交換操作が意味的に対称ではない**証拠。

## 6. 第二positive familyとしての位置づけ

v0.46:
- autumn-night-garden-moon
- central corridor固定 + A/E variation

v0.62:
- spring-plants / outing/place
- shared B固定 + outer-frame A variation

したがって、
異なる操作型・異なる季節sceneで
positive candidateを持つ二つ目のfamilyになった。

ただし hybrid-018 は
strong確定ではなく
**positive family candidate**。

## 7. 次

決定論的generatorを作る。

operation:
`shared-B-outer-frame-swap`

最低条件:
1. shared B
2. B morphology signature
3. donor A+B が歴史実証
4. host B+C/C+D/D+E を保持
5. strict palindrome
6. scene compatibility
7. outer-frame semantic-role compatibility
8. deep linguistic review

まず v0.62 の4出力をfixtureとして再現する。
