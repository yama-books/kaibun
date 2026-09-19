# CENTRAL_PIVOT_CANDIDATE_PIPELINE_V57

更新日: 2026-09-19  
研究層: v0.57

## 1. 目的

v0.54で得た repeated-D の新規E-only交換12件へ、
現在の研究原理を順番に適用する。

機械可読版:
- `data/central-pivot-candidate-pipeline-v57.json`

## 2. パイプライン

1. **operation shape**
   - E3だけ交換
   - host A/B/C/Dは固定
2. **D morphology**
   - D seamがこの操作で成立
3. **scene**
   - narrower scene互換性
4. **semantic role**
   - host中央部の意味役割を壊さない
5. **deep linguistic review**
   - 全文統語・視点・自然さ

## 3. 結果

機械的に作れる新規E-only交換:
**12件**

### deep-review-supported
2件:
- hybrid-016
- hybrid-019

### deep-review-needed-role
1件:
- hybrid-002

### hold-semantic-role-incompatible
1件:
- hybrid-017

### hold-scene-mismatch
8件:
- hybrid-025
- hybrid-028
- hybrid-029
- hybrid-030
- hybrid-033
- hybrid-034
- hybrid-038
- hybrid-041

自動accept:
**0件**

## 4. 意味

12件すべて:
- strict palindrome
- 局所factorは歴史実証済み

それでも、深いレビューへ送るのは3件だけ。

したがって、生成器にとって
`palindrome + attested factors`
は入口にすぎない。

## 5. 段階ごとの役割

### scene gate
大きく異なる景を先に落とす。

これだけで8件をhold。

### semantic-role gate
同じ意味場でも、
構造上の役割を壊すものを止める。

hybrid-017:
- 信仰sceneは一致
- しかし五大列挙を破壊
- hold

### deep review
残る:
- 016
- 019
- 002

ここで初めて全文統語を読む。

## 6. negative controls

今後の生成器評価では、
「良い候補」だけでなくhold候補も残す。

理由:
- scene gateを削除したら何が漏れるか
- role gateを削除したら何が漏れるか
- morphology gateが必要な理由

を回帰テストできる。

## 7. 次

このパイプラインを
**研究用生成器の実行契約**へ変換する。

公開UIへはまだ入れない。

まず:
- 入力: topic / scene
- operation: E-only central pivot exchange
- 出力: candidate + gate trace
- 各候補に「どのgateを通過/停止したか」を保持

とする。
