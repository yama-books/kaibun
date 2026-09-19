# AUTUMN_MOON_SEAM_REVIEW_QUEUE_V50

更新日: 2026-09-19  
研究層: v0.50

## 1. 目的

v0.45で seam 未分類のため止まった秋・月候補7件を、
候補ごとではなく **一次資料で確認すべき seam 3件**へ圧縮する。

機械可読版:
- `data/autumn-moon-seam-review-queue-v50.json`

## 2. 結果

未分類7候補は次の3 seamだけで止まっている。

| seam | slot | 影響候補数 | 元歌 |
|---|---|---:|---|
| むす ↔ すむ | D2 | 3 | shoju-add-109 嫁娘見月 |
| こた ↔ たこ | D2 | 3 | shoju-038 田毎月 |
| たま ↔ また | B2 | 1 | shoju-031 同（露） |

したがって、まず `むす` と `こた` を確認すれば、
最大6候補の次段レビュー可否を一度に判断できる。

## 3. D=むす

影響:
- hybrid-003
- hybrid-007
- hybrid-014

元歌文脈:
- ku3: `むすめよめ`
- ku4: `すむはらそみる`

現段階では:
- raw reverse `むす → すむ` は機械的事実
- morphology は未確定

禁止:
「むすめ」「住む」などの分節を、
回文として都合が良いという理由だけで確定しない。

## 4. D=こた

影響:
- hybrid-004
- hybrid-010
- hybrid-015

元歌文脈:
- ku3: `こたしろし`
- ku4: `たこともちみる`

現段階では:
- raw reverse `こた → たこ`
- morphology は未確定

特に語感だけで `こた` / `たこ` の語義を当てない。

## 5. B=たま

影響:
- hybrid-019

元歌文脈:
- ku2: `たまはのきはの`
- mirror側に `また...`

重要:
v0.36では reverse側の `また` が既に

- confidence: low-for-crossover
- transferable: false
- 前向き形態が曖昧

と判定されている。

したがって、
`たま` を「`また`の逆だから実証済み」と扱うのは禁止。

これはむしろ独立parseが必要な警戒seam。

## 6. レビュー順

同率最優先:
1. D=`むす`
2. D=`こた`

その後:
3. B=`たま`

理由は「正しそうか」ではなく、
**一件の確認で何候補の判定が進むか**。

## 7. 確認後の扱い

仮に transferable と判定されても、
候補は自動採用しない。

変わるのは:
- seam-classification-needed
  → semantic/human review eligible

まで。

non-transferable なら:
- affected candidatesはhold継続

削除はしない。

## 8. 次

一次資料・校訂転写・信頼できる独立資料から、
`むす / こた / たま` の文脈を探す。

見つからない場合は未分類のまま維持し、
この3 seamを使わない別scene familyへ研究を移す。
