# 公開β v0.35 / ワイ→いわライブラリ・公開導線整理

更新日: 2026-09-20

## 1. ワイ→いわ

新しい主語・文末対応を追加した。

基本対応:

- 主語・話題側: `ワイ` / reading `わい`
- 文末側: `…いわ`
- 注記: 文末「〜わ」（女性言葉）としての用法
- layer: L1
- register: spoken-feminine

generation rule:

`L1-WAI-IWA-FRAME`

pattern:

`わい{pal_center}いわ`

public variants:

1. `ワイ、いいわ。`
   - reading: `わいいいわ`
   - strict palindrome

2. `ワイ、ないわ。`
   - reading: `わいないわ`
   - strict palindrome

data:

- `data/generation-rules-v08.json`
- `data/layered-seeds-v08.json`

library metadata:
`subject_suffix_library / wai-iwa`

### safety

これはgeneric reverse-lexeme particle pairには入れない。

つまり:

`ワイ + 任意助詞 + いわ`

を機械的に増やさない。

自然に文末「…いわ」が成立する
専用suffix frameとしてのみ使う。

validatorでも、
`わい / いわ`
が `reverse-lexeme-pairs-v09.json`
へ入った場合はfailureにする。

## 2. corpus / DNA counts

追加後:

- L1 seeds: 161
- L2: 30
- L3: 83
- total seeds: 274
- DNA rules: 66

L1 DNA pool:
- total unique: 453
- recursive kinship: 216
- nonrecursive: 237

recursive exposure cap:
- 25%のまま

候補追加によって自然母数だけ:
- 47.9% → 約47.7%

へ変化した。

ten-item combined L1 pool:
- 489 → 491

表示quota:
- seed nonrecursive 3
- nonrecursive DNA 3
- recursive kinship 2
- seam/bridge 2

は変更なし。

## 3. public UI v0.35

badge:
`公開β v0.35`

公開導線を3 stepへ整理。

### ① 雰囲気を選ぶ

- 第一層 標準日本語
- 第二層 意味の通る怪文
- 第三層 実験文
- 怪文度上限

### ② 回文を作る

primary:
- 回文を1本つくる
- 別の回文をつくる
- 10本くらべる

advanced foldout:
`作り方を選ぶ`

中:
- 逆語ペアで作る
- 継ぎ目型で作る

つまり内部生成方式は削除せず、
初見ユーザーのprimary pathからだけ外した。

### result

常時表示:
- 回文成立
- 長さ
- 読みヒント（該当時）
- reading
- mirror visualization

foldout:
`この回文の説明・詳細`

中:
- 説明
- 日本語評価
- 怪文度
- 外枠
- family
- origin

### 10本比較

旧:
- origin
- 日本語評価
- 怪文度

を一覧に表示。

新:
- 文
- かな数

だけ。

候補を選んだ後は通常の詳細表示で
内部情報を確認できる。

### ③ 気に入ったら長くする

- 今の回文を長くする
- 段階的長文化
- 文レベル長文化

`growCurrent`
を②から③へ移した。

## 4. technical route

`仕組み・検証情報`
をfoldout化。

保持:
- DNA規則
- 再帰候補
- 逆語ペア
- 実効候補
- 物語型
- 100かな基準
- 外枠
- 継ぎ目
- 全件回文検証

研究・検証情報は削除せず、
public play pathから外した。

## 5. public metadata

追加:

- meta description
- theme-color
- color-scheme
- Open Graph title
- Open Graph description
- Open Graph type

## 6. mobile / real-device

v0.34の実機対応を維持:

- viewport-fit=cover
- iPhone safe area
- 44px touch target
- horizontal overflow diagnostic
- visual viewport
- orientation update
- `?debug=mobile`

diagnostic copy stringも
v0.35へ更新。

manual M03/M05は
新public pathに合わせて更新。

normal:
`https://yama-books.github.io/kaibun/`

diagnostic:
`https://yama-books.github.io/kaibun/?debug=mobile`

## 7. contract

file:
`data/public-release-ui-path-v132.json`

version:
`1.32`

invariants:

- UI reorderingでgeneration probabilityを変えない
- advanced generation methodを削除しない
- historical research candidateをpublicへ出さない
- wai-iwaをgeneric particle pairへ広げない
- technical statsをprimary pathへ戻さない

## 8. CI / deployment

public beta head:
`a90b7eb5376f408fde40bc6310c4a87e87925023`

Validate:
- run `35483146043`
- **success**

Pages:
- run `35483146139`
- **success**

environment:
`https://yama-books.github.io/kaibun/`

## 9. 次

実機では:

1. normal URLでpublic pathを見る
2. diagnostic URLでM01-M10
3. 問題があれば診断結果＋M番号を回収
4. UI修正
5. human quality review / adjudicationへ進む

歴史研究側のguardは変更していない。
