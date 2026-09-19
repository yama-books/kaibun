# HISTORICAL_GENERATOR_CONTRACT_V58

更新日: 2026-09-19  
研究層: v0.58

## 1. 目的

v0.44〜v0.57で得た研究原理を、
**実装可能な研究用生成器の契約**へ変換する。

機械可読版:
- `data/historical-generator-contract-v58.json`

公開UIへはまだ接続しない。

## 2. 現在有効にする操作

### central-E-swap

最初に実装する。

host:
- A/B/C/D を固定

donor:
- 同じDを持つ別歴史作の E3

のみを交換する。

理由:
E3は31かなの中央ABAで、
交換しても外側の鏡像境界を動かさない。

現在最も説明しやすく、
negative controlも揃っている。

### scene-microgrammar

v0.46のように、
sceneごとに明示された選択肢だけを組み合わせる。

central-E-swapの次。

### general-factor-crossover

**無効。**

A/B/C/D/Eを自由に混ぜる方式は、
現在の研究では安全条件が足りない。

## 3. gate順

### 1 structural palindrome
- 31かな
- strict reverse一致

### 2 historical attestation
- 変更する局所接続が歴史実証済みか
- host内で動かしていない要素を「transferした」と誤判定しない

### 3 morphology
- 実際に動かす/別sourceへ接続する境界を重点確認
- global
- conditional
- conditional-source-specific
- blocked
を分離

### 4 scene
- broad topicだけでは不可
- narrower sceneを見る

### 5 semantic role
- host中央句の役割を壊さないか
- 列挙・描写・評価等

### 6 source confidence
- trusted
- mining
- source-image-needed
を保つ

### 7 deep linguistic review
- 統語
- 視点
- 時間
- 主体
- 語義
- forcedness

ここまで通っても
機械は「自然な古典短歌」と確定しない。

## 4. candidateが必ず持つもの

- reading
- meter
- A/B/C/D/E
- host source
- donor source
- operation
- strict palindrome
- attestation trace
- morphology trace
- scene trace
- semantic role trace
- source confidence trace
- review status
- cautions

## 5. negative controlも捨てない

v0.57:
- positive/review-supported: 016, 019
- deep review needed: 002
- role negative: 017
- scene negative: 8件

これらをfixtureとして残す。

生成器の改修で、
本来sceneで止まる候補が急に通るようになったら
回帰として検知できる。

## 6. 重要な設計原則

### 「動かした要素」だけtransfer判定する

v37までの一般crossoverでは、
候補に含まれるB/D全部をglobal seamとして見ていた。

central-E-swapでは
B/Cはhostから動かない。

したがって、
Bがglobal transferableでなくても
**host文脈に固定されている限り、その理由だけでE-swapを止めない。**

これが hybrid-002 再検討の根拠。

### 不確実性はtraceに残す

例:
hybrid-019:
- palindrome: pass
- D morphology: high
- B=たま: source-specific
- scene: pass/reviewed
- role: pass/reviewed
- source image: pending
- deep review: promising-but-parse-needed

のように、
一つのstatusへ潰さない。

## 7. 実装順

1. central-E-swap列挙
2. 全候補にgate trace
3. v0.57の12件と一致するかfixture検証
4. scene-microgrammar追加
5. 研究結果の品質確認後にのみ公開生成器との接続を検討

## 8. 非目標

- LLM自由生成
- 自動漢字復元
- 自動自然度確定
- 候補数最大化
- wave2保留の自動昇格
- 50首ベースライン上書き

## 9. 次

v0.59で central-E-swap の
**決定論的研究スクリプト**を実装する。

入力:
- v0.34 five-variable grammar
- v0.32 semantic fields
- v0.36 seam signatures
- v0.57 gate fixture

出力:
- repeated-D E-only candidate universe
- gate trace
- v0.57との一致検査

公開index.htmlは変更しない。
