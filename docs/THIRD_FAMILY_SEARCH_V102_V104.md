# Third-family search v1.02–v1.04

更新日: 2026-09-19

## 目的

HANDOFF §35 の次工程として、guarded historical research universe から
既存の

1. autumn-night-garden-moon
2. naha-spring-plants

に続く第三の positive family を探索した。

結論は、**B=また family は negative regression へ固定し、D=むす source-specific corridor の hybrid-007 を第三family候補として残す**、である。

ただし hybrid-007 はまだ `deep-review-supported` ではなく、
`promising-but-parse-needed` に留める。

---

## 1. v1.02 B=また outer-frame morphology review

対象:
- shoju-001-komatsuhiki「小松引」
- shoju-010-somokuka「草木花」
- hybrid-001
- hybrid-012

両歴史作は B2=`また` を共有するが、同じmorphology nodeとして扱えるとは確認できなかった。

山内潤三の翻刻・語彙分析では:

- 「草木花」側の `またるる` は **待た(るる)** と明示的に分析される。
- 「小松引」側は `またひけ` と翻刻され、近接述語 **引け** は確認できるが、
  B=`また` を同じ 待た- と確定するだけのB単位の根拠は得られていない。

よって:

- same raw B = true
- morphology equivalence confirmed = false
- non-equivalence proven = false
- global B=また transferable = false
- hybrid-001 / hybrid-012 = hold-source-specific

重要なのは「違うと断定」ではなく、
**同じだと確認できないため結ばない**こと。

これは v1.00 の D=`みつ` と同じく、
palindrome cell equality と morphology identity を分離するnegative regressionになる。

Data:
- `data/mata-outer-frame-morphology-review-v102.json`

---

## 2. v1.03 D=むす source-specific corridor

v0.51 / v0.52 で D=`むす` は global seam ではなく、
shoju-add-109「嫁娘見月」の B/C/D/E corridor を保つ場合だけ
semantic review へ進める source-specific seam とされていた。

host:
- shoju-add-109「嫁娘見月」
- B = `きつ`
- C = `るみそらは`
- D = `むす`
- E = `めよめ`

山内翻刻:
`なかよさの 来つるみそらは むすめよめ すむはらそ見る つきのさ夜かな`

Dについて安全に言える範囲:
- forward `むす` は表出した `むすめ` 内
- reverse `すむ` は次の mirrored phrase の先頭
- reverse側の厳密な語彙・統語解析は未確定
- global transferは禁止

---

## 3. 三候補の比較

### hybrid-007 — best current candidate

`なかきよの / きつるみそらは / むすめよめ / すむはらそみる / つきのよきかな`

outer A source:
- shoju-038「田毎月」

既存human-tentative scene evidence:
- `なかきよの` → 長き夜の / time
- `つきのよきかな` → 月の良きかな / celestial + evaluation

host corridor:
- 嫁・娘・月
- みそら
- 見る
- 月
- 夜

したがって、外枠は新しい場所を持ち込まず、
hostの月夜sceneへ time / moon evaluation を足す方向に働く。

判定:
- structural: pass
- local attestation: pass
- source-specific D corridor: pass
- scene: review-pass
- semantic role: compatible-tentative
- deep linguistic review: parse needed

**review_status = `promising-but-parse-needed`**

未解決:
- `来つるみそらは` の厳密な統語
- `すむはらそ見る` の厳密な語彙・統語

したがって第三positive family「確定」にはまだ上げない。

### hybrid-003 — scene negative control

outer A source:
- shoju-040「月明海上鴻鷹渡」

明示的な海景sourceを family/sky/moon corridor に接続するため、
確実な重なりは generic 月 level に寄る。

**review_status = `hold-scene-mismatch`**

### hybrid-014 — source-parse control

outer A source:
- shoju-035「同（月）」

v0.49で A=`はれつみよ` の意味は明示的に unresolved のまま。
第五句側に月が見えるだけでouter-frame全体のsceneを補完しない。

**review_status = `hold-source-confirmation`**

Data:
- `data/musu-moon-family-review-v103.json`

---

## 4. v1.04 deterministic research generator

追加:
- `scripts/generate-musu-moon-outer-frame-research.mjs`
- `data/generated-musu-moon-outer-frame-v104.json`

生成対象:
1. shoju-add-109 historical source
2. hybrid-007 promising-but-parse-needed
3. hybrid-003 hold-scene-mismatch
4. hybrid-014 hold-source-confirmation

generator invariants:
- host B/C/D/E is always shoju-add-109
- changed slot is A only
- D=`むす` never becomes globally transferable
- strict 31-kana palindrome
- meter = 5/7/5/7/7
- machine never emits accepted/natural
- v1.04 fixture drift check
- common candidate schema v0.61 required fields

CI workflowにも
`node scripts/generate-musu-moon-outer-frame-research.mjs --check`
を追加した。

---

## 5. 現在の研究上の位置づけ

確立済み positive family:
1. autumn-night-garden-moon
2. naha-spring-plants

第三family:
- **musu-night-sky-family-moon**
- status: `third-positive-family-candidate-not-yet-established`
- best novel: hybrid-007
- automatic acceptance: 0

ここで「positive familyを3個に増やした」とは数えない。
第三familyは、残る2つの統語問題を解決または十分に評価してから昇格を判断する。

## 次

最優先は hybrid-007 の unresolved syntax:
1. `来つるみそらは`
2. `すむはらそ見る`

原画像または独立した信頼できる転写・語釈が得られれば、
`promising-but-parse-needed` からの昇格可否を再判定する。

それが詰まる場合は、第三familyを無理に昇格させず、
別の scene family を探索する。
