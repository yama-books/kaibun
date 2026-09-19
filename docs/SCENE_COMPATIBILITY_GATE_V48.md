# SCENE_COMPATIBILITY_GATE_V48

更新日: 2026-09-19  
研究層: v0.48

## 1. 問題

v0.46 と v0.47 は、どちらも次を満たす。

- 31かな完全回文
- 固定50首内の秋・月
- 五句すべて歴史実証
- 局所 factor 接続が実証済み
- B/D seam が分類済み

しかし人手評価は大きく異なった。

### v0.46
夜・庭・萩・月 family

- novel 3
- strong/promising 3

### v0.47
海上月・雁 control family

- novel 3
- strong/promising 0
- hold 2
- reject 1

したがって、
**broad field = 秋・月 は生成ゲートとして粗すぎる**。

## 2. v0.48 の目的

意味場を一段細かくし、

`broad topic → scene → factor compatibility`

の順で制約する。

ただし、現時点のscene情報は十分に構造化されていない。
そのため v0.48 は完成した自動分類器ではなく、
**安全側のgate仮説**として定義する。

機械可読版:

- `data/scene-compatibility-gate-v48.json`

## 3. generic tag と scene-specific tag

generic:

- 秋
- 月

これらは候補母集団を作るには有用だが、
別sourceのfactorを自動交配する根拠には弱い。

scene-specific の例:

- 夜
- 萩
- 葉
- 庭
- 海
- 鴻雁
- 田
- 家族

## 4. evidence tier

### Tier A
prior human semantic review

v0.40のように、人手で全文sceneの整合性を見たもの。

用途:
structured tag が不足していても、
研究候補として次段へ進める根拠にできる。

注意:
古典語として正しいことの証明ではない。

### Tier B
source title / source-supported scene tag

例:
「月明海上鴻鷹渡」→ 海 / 鴻雁

用途:
generic以外のscene overlapを機械的に確認する。

### Tier C
broad field only

例:
秋・月

用途:
候補母集団まで。
**自動crossoverの根拠にはしない。**

## 5. gate v1

前提:

1. strict palindrome
2. 五句すべて歴史実証
3. B/D seam complete + nonblocked

その上で:

### automatic pass
importするfactorが、
core sceneと generic以外のscene tagを1つ以上共有。

### review pass
structured overlap が無くても、
人手semantic reviewがscene coherenceを明示的に承認。

### hold
どちらも無い。

重要:
missing metadata は incompatibility ではない。

**情報不足なら reject ではなく hold。**

## 6. v0.46への適用

core scene:
- 秋/月
- 夜
- 萩
- 葉
- 庭

このsceneは主にv0.40のtentative parseから得たもの。

hybrid-008 / 016 / 022 は
structured v0.32 tagだけでは十分に説明できないが、
v0.40で semantic coherence = high と人手確認済み。

したがって:

- hybrid-008: review-pass
- hybrid-016: review-pass
- hybrid-022: review-pass

ここで structured data が薄いからといって
良い候補を機械的に落とさない。

## 7. v0.47への適用

core:
- 月
- 海
- 鴻雁

import A:

### shoju-038
- 田毎月
- 月
- 田

non-generic overlap:
- なし

hybrid-006:
- human semantic coherence = medium
- hold

### shoju-035
- 月
- 秋

non-generic overlap:
- なし

hybrid-013:
- human semantic coherence = medium-high
- hold

### shoju-add-109
- 月
- 嫁
- 娘

non-generic overlap:
- なし

hybrid-009:
- human semantic coherence = medium
- reject-for-now in v0.40
- gate自体では hold。reject判断は人手層を保持。

## 8. 重要な区別

v0.48は
`semantic gate` と `human review outcome` を混ぜない。

たとえば hybrid-009:

- mechanical scene gate: hold
- prior human review: reject-for-now

機械gateがrejectを自動生成したわけではない。

## 9. 生成器への実装方針

今後の探索順:

1. broad topicを選ぶ
2. sceneを選ぶ
3. phrase/factor poolをsceneで絞る
4. seam gate
5. 31かな制約
6. scene compatibility gate
7. 人手文法・意味レビュー

現代怪文回文へ還元するときも、
「動物」「会社」「夜」などの粗いカテゴリだけでなく、
**一つの出来事・場所・視点**までsceneを狭める設計に対応する。

## 10. まだやらないこと

- v0.42 scoring weightsの書き換え
- scene overlapの点数化
- tagが無い候補の自動棄却
- AIだけでfactor-level意味を大量付与
- v0.48を公開生成器へ投入

## 11. 次

scene signatureを factor / phrase 単位で増やす。

ただし、
**本文・題・既存人手レビューから根拠が取れるものだけ**。

まずは v0.46 family の
A / C / D / E について、
何が「夜・萩・葉・庭・月」を担うのかを
evidence付きで分離する。
