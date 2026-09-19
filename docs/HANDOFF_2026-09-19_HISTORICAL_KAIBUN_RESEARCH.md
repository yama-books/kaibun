# 怪文回文メーカー / 江戸回文歌研究 引き継ぎ

更新日: 2026-09-19  
Repository: `yama-books/kaibun`  
Public: https://yama-books.github.io/kaibun/

---

## 0. この文書の位置づけ

長大化した会話を切り替えるための引き継ぎ正本。

次セッションでは、まずこの文書と下記の主要データを読み、**既存研究を再推測せず、この地点から継続すること**。

現在の主課題は、怪文回文メーカーを「左右に逆読み部品を置くだけの生成器」から進め、**江戸期の回文短歌・狂歌に見られる、語境界のずれ・意味場・統語役割転換を利用する生成器**へ発展させること。

---

# 1. ユーザーの最重要意図

目標は、単に長い完全回文を作ることではない。

良い回文の理想:

- かな列では完全回文
- 文法が壊れていない
- 局所的な意味が追える
- 読み終えると「なぜそうなった？」という怪文性がある
- 回文のために作った左右一対一の部品感が表面に出すぎない
- 語境界・品詞・統語役割が左右で異なってよい
- 全文として一つの場面・出来事・意味場を持つ

ユーザーの重要な指摘:

1. セリフの内外で同じ名詞を反復すると人工感が強いので避ける。
2. sentence wrapper は長文化には便利だが、外枠文法を左右一対一で作ると無理やり感が残る。
3. 江戸の著名な回文短歌  
   「長き夜の 遠の眠りの 皆目覚め 波乗り舟の 音の良きかな」  
   のように、**前後が一対一の語対応ではなく、全文を組み合わせたとき自然に意味が通る構造**を学びたい。
4. 歴史作例を広く採掘し、技法を経験則ではなく生成規則へ落としたい。
5. API/LLMによる無制約生成は当面主役にしない。規則・資料・検証可能性を重視。

---

# 2. 公開アプリの現状

公開URL:
https://yama-books.github.io/kaibun/

公開UIラベル:
`v0.26 / 境界ずらしDNA`

注意:
研究データは v0.42 まで進んでいるが、**研究成果をそのまま公開生成器へ全面統合してはいない**。
研究層と公開生成層を混同しないこと。

現行 growth engine:
- `data/growth-engine-v10.json`
- version: 0.30
- narrative family: 45
- narrative variants: 322
- sentence wrapper: 36
- wrapper名詞衝突回避あり
- 長文固定例は100かな超を検証済み

現行 seam grammar:
- `data/seam-grammar-v25.json`
- version: 0.26
- recipe: 42
- 「庭↔ワニ」「記録↔黒木」等の境界ずらし系

sentence wrapper は今後も補助機能として保持するが、歴史研究の主成果は **wrapper依存から離れる方向**。

---

# 3. 江戸回文歌研究の資料層

## 3.1 信頼済み歴史サンプル

`data/historical-kaibunka-samples-v27.json`

10首。

内訳:
- 石田未得『吾吟我集』 4首
- 大福窓笑寿『廻文歌百首』 4首
- 仙代庵 1首
- 宝船歌 1首

宝船歌は江戸の宝船・初夢文化で著名だが、成立自体は江戸以前まで遡る可能性があるため、江戸作者作品ではなく比較基準扱い。

歴史回文は現代かな厳密回文とは正規化が異なるため、
- display
- reading_display
- normalized_reading
- normalization
を分離して保存。

---

## 3.2 安定比較用 mining 40首

`data/historical-kaibunka-mining-v28.json`

山内潤三「廻文歌の限界と効用（下）」の翻刻を主資料として採掘。

現在:
- mining 40首
- trusted 10首
- 合計50首を**安定比較用ベースライン**として固定

この50首から v28〜v42 の理論を作っている。

重要:
50首モデルの再現性を保つため、第二波14首をまだ自動統合しない。

---

## 3.3 第二波 mining

`data/historical-mining-wave2-v39.json`

山内翻刻78番以降から追加調査。

そのままの転写で:
- 31かな
- 完全回文

を満たしたもの: **14首**

番号:
78, 79, 80, 81, 83, 84, 85, 86, 87, 90, 91, 93, 95, 96

保留:
82, 88, 89, 92, 94

保留理由:
OCR・踊り字・を/お・歴史仮名などの転写に疑義あり。

**絶対に「回文になるはずだから」と推測補正しないこと。**
原画像または信頼できるPDFで確認する。

---

# 4. 31かな回文短歌の構造上の大発見

## 4.1 韻律境界と鏡像境界

短歌:
`5 / 7 / 5 / 7 / 7 = 31かな`

通常句境界:
`5 / 12 / 17 / 24`

31かな回文で鏡像に写した境界:
`26 / 19 / 14 / 7`

両方を統合:
`5 / 7 / 12 / 14 / 17 / 19 / 24 / 26`

セル長:
**5 | 2 | 5 | 2 | 3 | 2 | 5 | 2 | 5**

ファイル:
`data/tanka-mirror-lattice-v28.json`
`docs/TANKA_MIRROR_LATTICE_V28.md`

意味:
句境界と鏡像境界は構造上一致しない。
したがって、回文短歌では**語境界の再分節が特殊技ではなく形式的にほぼ必須**。

---

## 4.2 5変数文法

`data/tanka-five-variable-grammar-v34.json`

31かなを

`A5 | B2 | C5 | D2 | E3 | reverse(D)2 | reverse(C)5 | reverse(B)2 | reverse(A)5`

と表せる。

五句:
- 第一句 = A
- 第二句 = B + C
- 第三句 = D + E
- 第四句 = reverse(D) + reverse(C)
- 第五句 = reverse(B) + reverse(A)

つまり独立に選ぶ主要要素は
- A5
- B2
- C5
- D2
- E3

だけ。

E3は構造上必ず ABA 型。

ただし重要なのは、A/B/C/D/Eを「単語」と見なさないこと。
**左右の形態素境界は別々に解析する。**

---

# 5. 50首から得た実証結果

## 5.1 第三句そのものは回文ではない

50首中:
- 第三句5かな自体が回文: **0 / 50**
- 中央3かな（15〜17字）は自己回文: **50 / 50**

したがって、
「中央に5かなの自己回文語を置く」
設計は歴史実作とはずれる。

中央3かなを、
- 単独語
- 助詞を跨ぐ列
- 活用語尾を跨ぐ列
として扱う。

例:
- めさめ
- はなは
- のよの
- りけり
- りなり

中央3かなの外側文字が助詞系だったもの:
**32 / 50 = 64%**

これは助詞・境界が中央ピボットで大きな役割を持つことを示唆。

---

## 5.2 意味場

`data/historical-semantic-fields-v32.json`

50首の大分類:

- 春・草木: 12
- 秋・月: 12
- 信仰: 8
- 恋・人事: 6
- 冬・雪: 4
- 夏・行事: 4
- その他: 4

mining層の分類は、本文を勝手に解釈せず**題を根拠とする暫定分類**。

重要な結論:
歴史作の自然さは「逆読みに都合のよい語」より、
**一首全体の意味場を統一すること**に強く依存している可能性が高い。

---

# 6. 端の法則

`data/historical-edge-pairs-v33.json`

50首で冒頭2かな ↔ 末尾2かなを調査。

主な頻出:

- なか ↔ かな : 7首
- みな ↔ なみ : 3首
- やま ↔ まや : 3首
- もと ↔ とも : 2首
- やと ↔ とや : 2首

高価値例:

- なか ↔ かな  
  内容語の入口 → 終助詞「かな」
- みな ↔ なみ  
  皆 → 波
- みの ↔ のみ  
  名詞＋助詞 → 限定助詞
- しら ↔ らし  
  語彙的語頭 → 推量・様態
- ふゆ ↔ ゆふ  
  冬 → 夕
- わか ↔ かわ  
  若… → 川
- いけ ↔ けい  
  池 → 景 等
- むめ ↔ めむ  
  梅（歴史仮名）→ 助動詞的終止

生成原理:
**入口として自然で、逆側では別の自然な出口になる音を優先する。**

---

# 7. 継ぎ目署名

`data/historical-seam-signatures-v36.json`

かな列が同じでも、形態解析が違えば同じノードとして扱わない。

高信頼例:

### B2
- なは ↔ はな
  - 名は ↔ 花
  - transferable=true

### D2
- はに ↔ には
  - 葉に ↔ 庭
- みな ↔ なみ
  - 皆 ↔ 波
- みつ ↔ つみ
  - 水 ↔ 罪
- けふ ↔ ふけ
  - 今日 ↔ 更け

conditional:
- きつ ↔ つき
  - 反転側「月」は強いが前向き側の形態解析を個別確認

危険:
- ほと
  - ほととぎす / ほど… / 仏
- また
  - 文脈で形態境界が変わる

**raw kana一致だけで交配してはいけない。**

---

# 8. 因子グラフ / 歴史作交配

## 8.1 v35

`data/historical-factor-hybrids-v35.json`

50首から
- AB
- BC
- CD
- DE

の局所接続を正例としてグラフ化。

歴史作で実際に使われた局所接続だけを通る新規経路:

**51候補**

そのうち大意味場が同じ:
**23候補**

注意:
局所接続がすべて実例でも、全文が自然とは限らない。

---

## 8.2 v37 フィルタ

`data/historical-hybrid-review-v37.json`

継ぎ目署名＋意味場でフィルタ。

- priority-semantic-review: 10
- review-unclassified-seam: 10
- hold-morphological-seam: 3
- hold-mixed-semantic-field: 28

---

## 8.3 v38 centoモデル

`data/historical-cento-candidates-v38.json`

重要な発見:

因子グラフ交配では、新しい31かな候補の
- 第一句
- 第二句
- 第三句
- 第四句
- 第五句

が**それぞれ歴史作で実在する句**になりうる。

新規性は句そのものではなく組み合わせ。

仮称:
**historical palindrome tanka cento**

本歌取りそのものとは呼ばない。

---

# 9. v40 人手レビュー

`data/historical-hybrid-curation-v40.json`
`docs/HISTORICAL_HYBRID_CURATION_V40.md`

priority 10件を人間的にレビュー。

結果:
- strong-promising: 1
- promising-but-parse-needed: 2
- hold-source-parse: 3
- hold-too-many-sources: 1
- reject-for-now: 3

最重要候補:
### hybrid-008
reading:
`なかきよのきつるもはきのはにてりてにはのきはもるつきのよきかな`

暫定分節:
- 長き夜の
- 来つるも萩の
- 葉に照りて
- 庭のきはもる
- 月の良きかな

status:
**strong-promising**

naturalness:
B+ tentative-classical

sources:
- shoju-038
- shoju-035

ただし:
- 「きつるも」の係り先
- 「きはもる」の漢字・語義
は原画像/校訂本文で要確認。

次点:
- hybrid-016
- hybrid-022

これらも source parse 確定前に正式採用しない。

---

# 10. v41 山内式可変spanモデル

`data/yamauchi-tokenization-model-v41.json`
`docs/YAMAUCHI_TOKENIZATION_V41.md`

山内潤三の語彙調査方法から生成器へ抽出した原理:

1. **可変長単位**
   - 固定長の「単語」に限定しない
   - 1〜7かな程度
   - 単語 / 複合語 / 助詞付き句 / 句全体を同じグラフ上で扱う

2. **助詞付き署名**
   - 助詞を切り捨てない
   - 例: 名(は) ↔ 花
   - 葉(に) ↔ 庭

3. **句レベル実証を強く評価**
   - 5かな・7かなの歴史的実例を、短いセル一致より高く評価

4. **不確実性保持**
   - trusted / mining / source-image-needed を分離
   - 回文性だけでOCR修正しない

5. **複数解析**
   - 同じreadingでも形態署名が違えば別node

推奨unit schema:
- reading
- span_length
- surface_candidates
- morphology_signature
- attached_particles
- semantic_field
- source_attestation
- reverse_reading
- reverse_analysis_candidates
- confidence
- transferable

---

# 11. v42 「題を先に選ぶ」

`data/historical-topic-first-model-v42.json`
`docs/HISTORICAL_TOPIC_FIRST_V42.md`

現在の研究の最重要方針。

従来:
`回文になる音 → 意味を付ける`

今後:
`題 → 意味場 → 句候補 → 31かな制約`

優先研究題:

### 秋・月
最優先。
- 月
- 萩
- 露
- 紅葉
- 初雁
- 田毎月
- 月夜
- 海上月

推奨継ぎ目:
- なか↔かな
- きつ↔つき
- はに↔には
- けふ↔ふけ

### 春・草木
最優先。
- 梅
- 桜
- 若草
- 七草
- 小松
- 霞

推奨:
- なは↔はな
- むめ↔めむ
- わか↔かわ

### 神祇・釈教
- みつ↔つみ
- けふ↔ふけ

### 冬・雪
- ふゆ↔ゆふ
- しら↔らし
- はに↔には

### 羈旅・恋・人事
- みの↔のみ
- さよ↔よさ
- やま↔まや

v42 scoring weights:
- global_topic_coherence: 5
- each_ku_naturalness: 4
- seam_signature_compatibility: 4
- historical_phrase_attestation: 3
- boundary_shift_quality: 3
- pivot_quality: 2
- surface_palindrome_obviousness_penalty: -2
- proper_name_forcedness_penalty: -3

最重要:
**五句すべてが同じ場所・季節・時間・出来事を見ているかを最優先する。**

---

# 12. 史料上の重要候補

## 『廻文歌詞之種』

国文学研究資料館 国書データベース:

- 書名: 廻文歌詞之種
- よみ: かいぶんうたことばのたね
- BID: 100437979
- デジタル画像: DIG-SEKD-70815
- URL: https://kokusho.nijl.ac.jp/biblio/100437979

記録:
`docs/HISTORICAL_RESEARCH_LEADS_V29.md`

未確定:
- 著者
- 成立年代
- 内容
- 実際に「回文作成用の語彙・作法集」なのか
- 『廻文歌百首』等との関係

**画像を確認するまで内容を推測しない。**

もし本当に「ことばの種」資料なら、
現在の
- reverse lexeme pair
- seam signature
- seed corpus
- semantic field
と歴史的作法を直接比較できる可能性がある。

---

# 13. 情報源の扱い

主な資料:

1. 山内潤三
   「廻文歌の限界と効用（下）―高野山釈教長歌を頂点として―」
   『密教文化』107号, 1974

2. 京都大学貴重資料デジタルアーカイブ
   『吾吟我集』

3. 国立国会図書館 レファレンス協同DB
   宝船歌の由来

4. 国文学研究資料館 国書データベース
   『廻文歌詞之種』

5. 仙代庵・作並関係地域資料

注意:
ウェブ上の二次転写は採掘用には使えるが、
**漢字復元・踊り字・歴史仮名・OCR疑義があるものを trusted に昇格しない。**

---

# 14. 現在のCI / Pages

この引き継ぎ作成直前:

- Latest corpus validation:
  - run 35414961088
  - conclusion: success
  - head: `40183aa3b7a8529af067a7d033ef06c3e21919e3`

- Latest Pages:
  - run 35414975841
  - conclusion: success
  - head: `a3fc2c6f74eb0e184d0d0f6a2eba9d04e5119349`

`scripts/validate-corpus.mjs` は歴史研究層も検査対象。

研究データを更新したら必ずCI結果を見ること。

---

# 15. 次セッションの推奨作業順

## Phase A: 史料の精度を上げる

### A1
wave2保留5件:
- 82
- 88
- 89
- 92
- 94

をJ-STAGE PDFまたは原画像で確認。

**回文になるよう推測修正しない。**

### A2
『廻文歌詞之種』のデジタル画像を確認できるか調査。

目的:
- どんな単位で語を集めているか
- 助詞込みか
- 逆読みに対応する語を並べているか
- 題別か
- 実際の作歌手順があるか

---

## Phase B: コーパス拡大

現行50首は比較ベースラインとして残す。

第二波14首を統合する場合:
- 旧50モデルを上書きしない
- 64首版として新versionを作る
- v28/v32/v33/v34/v36の統計を再計算
- 50→64で法則が維持されるか比較

その後:
- 100首
- 150首
- 可能なら山内の303首
へ段階的に増やす。

---

## Phase C: 生成器研究

最優先は **秋・月**。

理由:
- 歴史50首中12首
- hybrid-008など有望候補が出ている
- 月・萩・露・庭・夜など相互に意味場を作りやすい
- 高信頼継ぎ目が複数ある

### C1 可変span辞書
固定A/B/C/D/Eだけでなく、
1〜7かな span + morphology_signature + semantic_field
の辞書を作る。

### C2 題別句候補
秋・月について
- 5かな句
- 7かな句
- 助詞付きspan
- 逆側の再解析
を蓄積。

### C3 制約充足
題を固定して
- A
- B+C
- D+E
- Dᴿ+Cᴿ
- Bᴿ+Aᴿ
を同時に自然化する探索器を作る。

### C4 評価
機械スコアだけで「自然」と断定しない。

必須:
- 全文意味場
- 各句文法
- 視点
- 時間
- 主体
- 古典語/現代語の適切さ
- forced proper name penalty
- 回文部品露出 penalty

---

# 16. 現代「怪文回文メーカー」への還元

歴史回文短歌研究は、古典短歌生成だけが目的ではない。

最終的には現代散文の怪文メーカーへ、

- 境界ずらし
- 左右で異なる形態解析
- 内容語→助詞/語尾への転換
- 意味場を先に決める
- 中央ピボット
- 語ではなく可変spanで生成
- 全文評価

を輸入する。

特に今後、
**sentence wrapperを何重にも重ねる方式より、1文内部で語境界が自然にずれる長文**
を優先する。

---

# 17. やってはいけないこと

1. OCRが回文にならないからという理由で勝手に文字を補う。
2. miningデータをtrusted扱いする。
3. かな列一致だけで同じ継ぎ目nodeとみなす。
4. 意味場が違う歴史作を、回文になるというだけで交配する。
5. 第三句5かなを自己回文核として固定する。
6. 左右の語境界を一致させることを要求する。
7. sentence wrapperの長さだけを「進歩」とみなす。
8. proper nameを対称性のためだけに大量導入する。
9. hybrid-008を「自然な古典短歌として確定」と扱う。
10. 50首統計と、今後の64/100/303首統計を同じものとして上書きする。

---

# 18. 主要ファイル一覧

## 公開生成器
- `index.html`
- `data/layered-seeds-v08.json`
- `data/generation-rules-v08.json`
- `data/reverse-lexeme-pairs-v09.json`
- `data/growth-engine-v10.json`
- `data/seam-grammar-v25.json`

## 歴史研究
- `data/historical-kaibunka-samples-v27.json`
- `data/historical-kaibunka-mining-v28.json`
- `data/tanka-mirror-lattice-v28.json`
- `data/historical-mining-wave2-v39.json`
- `data/historical-semantic-fields-v32.json`
- `data/historical-edge-pairs-v33.json`
- `data/tanka-five-variable-grammar-v34.json`
- `data/historical-factor-hybrids-v35.json`
- `data/historical-seam-signatures-v36.json`
- `data/historical-hybrid-review-v37.json`
- `data/historical-cento-candidates-v38.json`
- `data/historical-hybrid-curation-v40.json`
- `data/yamauchi-tokenization-model-v41.json`
- `data/historical-topic-first-model-v42.json`

## 主要docs
- `docs/CLASSIC_KAIBUN_SEAMS_V25.md`
- `docs/EDO_KAIBUNKA_SAMPLES_V27.md`
- `docs/TANKA_MIRROR_LATTICE_V28.md`
- `docs/HISTORICAL_RESEARCH_LEADS_V29.md`
- `docs/HISTORICAL_SEMANTIC_FIELDS_V32.md`
- `docs/HISTORICAL_EDGE_PAIRS_V33.md`
- `docs/TANKA_FIVE_VARIABLE_GRAMMAR_V34.md`
- `docs/HISTORICAL_FACTOR_HYBRIDS_V35.md`
- `docs/HISTORICAL_SEAM_SIGNATURES_V36.md`
- `docs/HISTORICAL_HYBRID_REVIEW_V37.md`
- `docs/HISTORICAL_CENTO_V38.md`
- `docs/HISTORICAL_MINING_WAVE2_V39.md`
- `docs/HISTORICAL_HYBRID_CURATION_V40.md`
- `docs/YAMAUCHI_TOKENIZATION_V41.md`
- `docs/HISTORICAL_TOPIC_FIRST_V42.md`

## 検証
- `scripts/validate-corpus.mjs`
- `.github/workflows/validate.yml`

---

# 19. 次セッション用プロンプト

以下をそのまま次セッションに渡せる。

> 怪文回文メーカーの研究を引き継ぎます。  
> GitHub `yama-books/kaibun` の  
> `docs/HANDOFF_2026-09-19_HISTORICAL_KAIBUN_RESEARCH.md`  
> を最初に読み、そこを正本として再開してください。
>
> 現在は江戸回文短歌研究を生成器へ還元する段階です。公開UIの機能追加を急ぐより、歴史資料の解析と生成原理の精緻化を優先します。
>
> 特に重要なのは、
> - 31かなの 5|2|5|2|3|2|5|2|5 鏡像格子
> - A5/B2/C5/D2/E3 の5変数文法
> - 語境界を左右で一致させない
> - raw kana一致ではなく形態的 seam signature を使う
> - 題→意味場→句候補→31かな制約、の topic-first 方針
> - OCRを回文性だけで推測補正しない
> - 現行50首ベースラインは固定し、第二波14首は別層
> です。
>
> まず引き継ぎ文書と v40〜v42 のデータを確認して、現在地点を短く報告してください。その後、作業を止めずに次の優先課題へ進んでください。
>
> 優先順位は、
> 1. wave2保留5件の一次資料確認、または『廻文歌詞之種』の画像・内容調査
> 2. 50首→64首へ統合する場合の比較可能な新version設計
> 3. 秋・月を第一題として、山内式の可変span＋seam signatureを使うtopic-first生成器の研究実装
> 4. 生成候補は機械スコアだけで自然と判定せず、人間的文法・意味レビューを行う
> です。
>
> 作業結果はこまめにGitHubへ記録し、長くなる場合はdocs/dataへ中間成果を保存して断絶を防いでください。公開UIは、研究生成器の品質が十分に確認されるまで無理に変更しなくて構いません。

---

# 20. 再開時の最初の確認

次セッション開始時に最低限確認すること:

1. このHANDOFFを読む。
2. `data/historical-hybrid-curation-v40.json`
3. `data/yamauchi-tokenization-model-v41.json`
4. `data/historical-topic-first-model-v42.json`
5. 最新 `scripts/validate-corpus.mjs`
6. GitHub Actionsの最新Validate / Pages結果
7. その後、史料調査またはtopic-first生成研究へ進む。

以上。


---

# 21. 2026-09-19 12:36 JST 停止地点の確定

この節を今回のセッション停止時の最終チェックポイントとする。

## 正本
- このHANDOFF自体が歴史研究の引継ぎ正本。
- 公開生成器と歴史研究層は分離したまま維持。
- 研究側は v0.42 まで到達。
- 公開UIは v0.26 系で、歴史研究成果を未検証のまま全面投入していない。

## 直前までに確定した研究段階
1. trusted 10首 + mining 40首 = **50首の固定ベースライン**
2. 第二波として **14首の31かな完全回文**を別キューに保存
3. wave2保留は **82 / 88 / 89 / 92 / 94**
4. 31かな鏡像格子:
   **5|2|5|2|3|2|5|2|5**
5. 5変数文法:
   **A5 / B2 / C5 / D2 / E3**
6. 第三句5かな自体の回文: **0/50**
7. 中央3かなABA: **50/50**
8. 中央3かな外側文字が助詞系: **32/50 = 64%**
9. 意味場の大分類:
   - 春・草木 12
   - 秋・月 12
   - 信仰 8
   - 恋・人事 6
   - 冬・雪 4
   - 夏・行事 4
   - その他 4
10. 因子グラフ新規経路: **51**
11. seam signature + 意味場フィルタ後 priority-semantic-review: **10**
12. 人手レビューで最重要: **hybrid-008**
13. 山内式可変spanモデル v0.41
14. 題を先に選ぶ topic-first モデル v0.42

## 現在の最重要研究原則
- かな列の鏡像と語境界を一致させない。
- raw kana一致だけでは同一nodeとしない。
- morphology_signature / attached_particles / semantic_field を保持する。
- 5/7かなの歴史的句実証を短いセル一致より強く評価する。
- OCRは回文になるよう推測補正しない。
- **題 → 意味場 → 句候補 → 31かな制約**の順で生成する。
- 全5句が同じ景・時間・主体・出来事を共有することを最重視。
- sentence wrapperは補助。今後の本命は一文内部の境界ずらし。

## 次に手を付ける位置
最優先は以下のどちらか。

### Route A: 史料精度
- wave2保留 82 / 88 / 89 / 92 / 94 の一次資料確認
- 『廻文歌詞之種』画像内容調査

### Route B: 生成研究
- 秋・月を第一題に固定
- 1〜7かな可変span辞書を作る
- spanごとに morphology_signature / semantic_field / provenance / confidence を保持
- A/B/C/D/E格子へ句単位で制約充足
- 生成後に全文意味レビュー

## GitHub状態
停止直前に確認した最新状態:
- latest commit before this追記:
  `945344ec9a96983a418a3397efd65ec8ec22ce87`
  - message: `Add historical kaibun research handoff`
- latest Pages run:
  - run `35415967706`
  - conclusion: **success**
  - head: `945344ec9a96983a418a3397efd65ec8ec22ce87`
- latest corpus validation:
  - run `35414961088`
  - conclusion: **success**
  - head: `40183aa3b7a8529af067a7d033ef06c3e21919e3`

この追記は文書のみであり、生成データ・検証ロジックは変更しない。

## 再開時の一文
**「HANDOFFの21節を停止地点として、v40〜v42を確認後、史料精度Route Aまたは秋・月topic-first Route Bから再開する。」**


---

# 22. 2026-09-19 15:06 JST セッション終了チェックポイント

ユーザー判断により、この地点で今回の長大セッションを終了する。
次セッションでは本HANDOFFを**最優先の正本**として読み、過去会話を再構成し直さず、この地点から再開すること。

## 今回終了時点での研究状況

- 歴史研究の理論層は **v0.42** まで到達。
- 公開UIは研究成果を無理に全面投入せず、**v0.26系の境界ずらしDNA**を維持。
- 安定比較ベースラインは **trusted 10首 + mining 40首 = 50首**。
- 第二波 mining は別層で保持し、**14首を31かな完全回文として機械確認済み**。
- wave2保留は **82 / 88 / 89 / 92 / 94**。一次資料確認前に推測補正しない。
- 歴史50首から確定した主要構造:
  - 31かな鏡像格子: **5|2|5|2|3|2|5|2|5**
  - 5変数文法: **A5 / B2 / C5 / D2 / E3**
  - 第三句5かな自体が回文: **0/50**
  - 中央3かなABA: **50/50**
  - 中央3かな外側文字が助詞系: **32/50 = 64%**
- 意味場の大分類:
  - 春・草木 12
  - 秋・月 12
  - 信仰 8
  - 恋・人事 6
  - 冬・雪 4
  - 夏・行事 4
  - その他 4
- 歴史因子グラフ:
  - 新規経路 51
  - seam signature + 意味場フィルタ後 priority-semantic-review 10
  - 人手レビュー最重要候補: **hybrid-008**
- 生成研究の現在の最重要方針:
  **題 → 意味場 → 句候補 → 31かな制約**
- sentence wrapper は補助機構として維持するが、今後の主研究は
  **一文内部で語境界・品詞・統語役割がずれる回文**。

## 次セッションで最初に読むファイル

1. `docs/HANDOFF_2026-09-19_HISTORICAL_KAIBUN_RESEARCH.md`（この文書）
2. `data/historical-hybrid-curation-v40.json`
3. `data/yamauchi-tokenization-model-v41.json`
4. `data/historical-topic-first-model-v42.json`
5. `data/historical-mining-wave2-v39.json`
6. `scripts/validate-corpus.mjs`

## 再開優先順位

### 1. 史料精度 Route A
- wave2保留 82 / 88 / 89 / 92 / 94 の一次資料確認
- 国文学研究資料館『廻文歌詞之種』のデジタル画像・内容確認
- 回文性を根拠にOCRを推測修正しない

### 2. 生成研究 Route B
最初の題は **秋・月** を推奨。

- 1〜7かなの可変span辞書を作る
- 各spanに `morphology_signature / attached_particles / semantic_field / provenance / confidence` を付ける
- 5変数格子へ句単位で制約充足する
- raw kana一致だけでnodeを接続しない
- 歴史的5かな・7かな句の実証を短いセル一致より強く評価する
- 生成候補は機械スコアだけで自然と判定せず、全文の意味・文法・視点・時間を人間的にレビューする

## GitHub終了時点

- Repository: `yama-books/kaibun`
- Public: https://yama-books.github.io/kaibun/
- 本HANDOFF直前のHEAD:
  `3e8b214902bbb6e7bb9cf7ccc148bf1f2edfc019`
  - `Finalize historical research checkpoint`
- 直近確認済み Pages:
  - run `35419105818`
  - conclusion: **success**
  - head: `3e8b214902bbb6e7bb9cf7ccc148bf1f2edfc019`
- 直近確認済み corpus validation:
  - run `35414961088`
  - conclusion: **success**
  - head: `40183aa3b7a8529af067a7d033ef06c3e21919e3`

この節の追記では研究データ・生成ロジックを変更しない。

## 次セッションへの最短プロンプト

> 怪文回文メーカー研究を再開します。GitHub `yama-books/kaibun` の `docs/HANDOFF_2026-09-19_HISTORICAL_KAIBUN_RESEARCH.md` を正本として読み、**22節を最新停止地点**として引き継いでください。v40〜v42とwave2を確認し、まず現在地点を短く報告した後、Route A（史料精度）またはRoute B（秋・月topic-first生成研究）の優先度を判断して、そのまま作業を継続してください。

**今回のセッションはここで終了。**


---

# 23. 2026-09-19 16:15 JST 一時停止チェックポイント

ユーザー判断により、ここで一時区切る。
次回は本節を最新停止地点として再開すること。

## 今回追加した研究層

### v0.43 wave2 source triage

新規:
- `data/historical-wave2-source-triage-v43.json`
- `docs/WAVE2_SOURCE_TRIAGE_V43.md`

目的:
v0.39で一括保留していた 82 / 88 / 89 / 92 / 94 を、
「全部同じOCR疑義」とせず、問題の型ごとに分解した。

重要:
- **50首固定ベースラインは変更していない。**
- **wave2 v0.39 の verified 14首 / held 5首も変更していない。**
- 原画像未確認の候補を verified / trusted に昇格していない。
- 回文性を根拠にOCRを補正していない。

### 保留5件の再分類

1. **89 老賀**
   - 候補読み:
     `やそやおいかないよろこひますとしとすまひころよいなかいおやそや`
   - `八十=やそ` と読む場合、31かなの strict 完全回文。
   - 5件中もっとも昇格に近い。
   - ただし「回文になるからやそと読む」という循環を避けるため、
     原画像または明示的な読み根拠を確認するまで hold。
   - v0.43 status: `strongest-held-candidate`

2. **94 旅行（同）**
   - 31かな。
   - strict 不一致は、鏡像位置の **お/を** のみ。
   - 単なるOCR誤りとして潰さず、
     `strict_kana_palindrome` と
     `historical_equivalence_palindrome`
     を分離する将来設計の重要例として保持。
   - ただし現時点で歴史的等価規則は確定しない。

3. **82 音羽滝**
   - 31かな候補。
   - お/を に加え、踊り字・濁りの転写が絡む。
   - 原画像確認前に補正しない。

4. **88 百千鳥**
   - 現状の露出OCRでは32かな。
   - 中央部のOCR/分節崩れが大きい。
   - 画像なしで修復しない。

5. **92 旅行（同）**
   - 現状の露出OCRでは30かな。
   - 鏡像不一致が広く、OCR崩れが大きい。
   - 画像なしで修復しない。

v0.43 の画像確認優先順位:
**89 → 94 → 82 → 88 → 92**

## 史料アクセス状況

### 山内潤三論文

J-STAGE公式書誌で以下を確認:
- 山内潤三
- 「廻文歌の限界と効用（下）―高野山釈教長歌を頂点として―」
- 『密教文化』107号
- 1974
- pp.1-38
- DOI: `10.11168/jeb1947.1974.107_1`

ただし今回の実行環境では本文PDFを直接画像として取得できなかった。
検索インデックス上に露出したOCR/転写は、
**トリアージ用の二次証拠**に限定して使った。

### 『廻文歌詞之種』

国文学研究資料館 国書データベースで一次情報として以下を確認:
- 書名: 廻文歌詞之種
- よみ: かいぶんうたことばのたね
- BID: `100437979`
- 所蔵: 静嘉堂文庫
- 所蔵者函架番号: `５２１函２３架　２２４２６`
- デジタル請求記号: `DIG-SEKD-70815`
- 書誌URL: `https://kokusho.nijl.ac.jp/biblio/100437979`

画像本文は今回の環境では取得できなかったため、
次は未確認:
- 著者
- 成立年代
- 丁数・構成
- 語彙集 / 作例集 / 作歌手引きのどれか
- 題別配列か
- 助詞込みの語を収録するか
- 逆読み対応を明示するか

**書名から内容を推測しない。**

## validator 更新

`scripts/validate-corpus.mjs` に v0.43 の検証を追加。

検証すること:
- v0.43 version が 0.43
- 対象が 82 / 88 / 89 / 92 / 94 の5件
- 89候補列が機械的に完全回文
- source-image-unconfirmed を wave2 verified に昇格していない
- v0.39 baseline が verified 14 / held 5 のまま

初回 validator 追記コミット `7e0cec3...` は
文字列中に literal `\\n` が入り SyntaxError で Validate が失敗した。

その後修正し、最終修正コミット:
`6d3ad02a524ad7d185f77115c47876f41ecd8aa9`

最終確認:
- Validate palindrome corpus
  - run `35428038875`
  - conclusion: **success**
  - head: `6d3ad02a524ad7d185f77115c47876f41ecd8aa9`
- Deploy GitHub Pages
  - run `35428038877`
  - conclusion: **success**
  - head: `6d3ad02a524ad7d185f77115c47876f41ecd8aa9`

## 今回の主要コミット

- `2b5a9f0230467527f6899ac916a86a8834d9608d`
  - Add wave2 source triage v43
- `c9b79ed41c3f535206d106a503a80ca833c954c0`
  - Document wave2 source triage v43
- `7e0cec3ca46b3e80007b726bfcf916cc4a59bcd6`
  - Validate wave2 source triage v43
  - ※このコミット時点のValidateはSyntaxErrorで失敗
- `fa9ea81d73273b4cff1c741d41201ed2306f91bf`
  - Fix v43 validator syntax
- `6d3ad02a524ad7d185f77115c47876f41ecd8aa9`
  - Fix newline in v43 validator
  - **Validate / Pages とも success**

## Route B の停止位置

Route A が原画像アクセス待ちになったため、
並行して秋・月 topic-first 生成研究の準備に着手した。

確認済み:
- `data/historical-semantic-fields-v32.json`
- `data/tanka-five-variable-grammar-v34.json`
- `data/historical-edge-pairs-v33.json`
- `data/historical-seam-signatures-v36.json`

固定50首のうち秋・月 broad field は12首:
- shoju-030 露
- shoju-031 同（露）
- shoju-033 月
- shoju-035 同（月）
- shoju-038 田毎月
- shoju-040 月明海上鴻鷹渡
- shoju-041 初鷹
- shoju-043 名所苅
- shoju-044 紅葉
- shoju-045 九月尽
- shoju-add-109 嫁娘見月
- shoju-add-111 出来秋

既に確認した秋・月で重要な seam / edge:
- `なか↔かな`
- `きつ↔つき`
- `はに↔には`
- `けふ↔ふけ`
- `やと↔とや`
- `ゆつ↔つゆ`
- `やま↔まや`
- `てり↔りて`

特に:
- B2 `きつ↔つき`: conditional
- D2 `はに↔には`: high / transferable
- D2 `けふ↔ふけ`: high / transferable
- D2 `みな↔なみ`: high / transferable

**まだ作っていないもの**:
- 秋・月 1〜7かな可変span辞書
- 新しい topic-first candidate
- 50→64 の再統計

したがって次回は、ここから再開する。

## 次回の優先順位

1. 可能なら Route A:
   - 89 → 94 → 82 の原画像確認
   - 『廻文歌詞之種』画像取得
2. 画像アクセスが引き続き詰まる場合は Route B:
   - 固定50首の秋・月12首だけから
     **可変span辞書 v0.44** を作る
   - まず5かな/7かなの歴史実証句を最上位nodeとして登録
   - 1〜4かなの短spanは seam signature が明示できるものだけを優先
   - raw substring の全列挙はしない
3. v0.44 では
   `reading / span_length / surface_candidates / morphology_signature / attached_particles / semantic_field / provenance / confidence / transferable`
   を最低限持たせる。
4. その後に秋・月の制約充足候補を作る。

## 再開時の最短一文

**「HANDOFF 23節から再開。v0.43は完了・CI成功。Route Aの画像確認を再試行し、詰まる場合は秋・月12首から可変span辞書 v0.44 を作る。」**
