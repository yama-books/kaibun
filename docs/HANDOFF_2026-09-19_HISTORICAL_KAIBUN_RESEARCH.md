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


---

# 24. 2026-09-19 17:18 JST 研究generator実装チェックポイント

## 全体進捗目安

- 歴史回文研究・生成原理の確立: **約78%**
- 最終目標「怪文回文メーカーへ安全に統合し、実用生成品質まで持っていく」: **約60%**

これは厳密な工数比ではなく、残課題の難度を含む研究進捗の目安。
公開UI統合・実出力品質評価・別scene family拡張がまだ残るため、研究層の進捗より全体進捗は低く見る。

## v0.59 central-E-swap研究generator

実装:
- `scripts/generate-central-pivot-research.mjs`
- `data/generated-central-pivot-research-v59.json`

機能:
- repeated-D の E3-only 交換を決定論的に列挙
- 12候補を生成
- v0.57 fixtureと一致確認
- 候補ごとに gate trace を保持
- strict palindrome / meter / stage / trace drift を検査

CI:
- `node scripts/generate-central-pivot-research.mjs --check`
- GitHub Actionsで成功確認済み

確認済みrun:
- run `35431653368`
- conclusion: **success**
- head: `ceeeb579bd136b3015598c4b020bcece4d8fa5f6`

fixture内容比較を追加したcommit:
- `38a55f97dfd27d4dd88d209bcf1497bf8beb9290`
- Validate run `35431689810`: **success**

## v0.60 scene-microgrammar研究generator

実装:
- `scripts/generate-scene-microgrammar-research.mjs`
- `data/generated-scene-microgrammar-v60.json`

対象scene:
- `autumn-night-garden-moon`

再現:
- shoju-035
- hybrid-008
- hybrid-016
- hybrid-022

構造:
- A 2択 × E 2択
- B/C/D中央回廊固定
- total 4
- historical source 1
- novel cento 3

CI:
- `node scripts/generate-scene-microgrammar-research.mjs --check`
- GitHub Actions成功確認済み

確認済みrun:
- run `35431713137`
- conclusion: **success**
- head: `61330ed332140a07042b1fffab4a2086f68fc53e`

fixture固定:
- `4fbbdec4a3ef87193f54ba171c4127885e7945be`
- fixture drift検査追加:
  `4a2460973f471ffe8317c34fb8bc9064800ddd9f`

## v0.44〜v0.58で今回固まった主要理論

1. topic-first: 題 → scene → phrase/factor → 31かな制約
2. broad field一致だけでは不十分
3. scene compatibilityが必要
4. 同じsceneでも factor semantic role が必要
5. central E3-only交換は現在最も安全に説明できる生成操作
6. source-specific seamはglobal seamへ昇格させない
7. 「動かした要素」だけtransfer判定する
8. 全候補にgate traceを残す
9. machineはaccepted/naturalを自動生成しない
10. negative controlsを回帰fixtureとして残す

## central-E-swapの現在のfixture

新規12件:
- deep-review-supported: hybrid-016 / hybrid-019
- deep-review-needed-role: hybrid-002
- hold-semantic-role-incompatible: hybrid-017
- hold-scene-mismatch: 8件
- automatic acceptance: 0

## 史料側の現在地

v0.51で:
- B=たま: conditional-source-specific
- D=むす: conditional-source-specific
- D=こた: blocked継続

ただし原画像/PDFを直接確認していないため:
- source-image-confirmed昇格なし
- wave2 v39は verified 14 / held 5 のまま
- 50首baseline固定

## 公開側

- 公開UIは変更していない
- public generatorはv0.26系のまま
- v0.59/v0.60は research-only
- general-factor-crossover は disabled

## 次の大工程

1. v0.60 fixture drift CI成功を確認
2. 第二の positive scene family を作る
3. 研究generator共通出力schemaへ統一
4. modern 怪文回文向けbridge設計
5. 限定的に公開generatorへ統合
6. 実出力の人間的品質評価
7. 回帰試験後に公開UI更新

## 次回の最短再開文

**「HANDOFF 24節から再開。全体進捗約60%。v0.59 central-E-swap と v0.60 scene-microgrammar の2研究generatorはCI成功。v0.60 fixture driftの最終CIを確認し、第二positive scene familyまたは共通generator schemaへ進む。」**


---

# 25. 2026-09-19 17:18 JST 共通candidate schemaチェックポイント

## 進捗目安
- 歴史回文研究・生成原理: **約80%**
- 怪文回文メーカー全体目標: **約61%**

## v0.61 共通schema
新規:
- `data/historical-research-candidate-schema-v61.json`

目的:
central-E-swap と scene-microgrammar の候補を、同じ研究candidate形式で比較できるようにする。

必須項目:
- id
- operation
- reading
- meter
- factors
- strict_palindrome
- host_source_id
- donor_source_ids
- provenance
- attestation_trace
- morphology_trace
- scene_trace
- semantic_role_trace
- source_confidence_trace
- review_status
- cautions

重要:
- machine accepted/natural statusは禁止継続
- source-specific seamはsource-specificのままtraceする
- missing evidenceはhold/review-needed
- public UI consumptionはschema適合だけでは許可しない

## central-E-swap側
更新commit:
`383d0d48b279284fd35f25314b63fc971a39f9d1`

変更:
- v0.61共通candidate fieldを追加
- 既存fixture比較は維持
- candidateごとに donor_source_ids / attestation / morphology / scene / semantic role / source confidence / review status を出力

CI:
- run `35431795768`
- conclusion: **success**

## scene-microgrammar側
更新commit:
`610cb945b09ab379e6c4e720da138d4c80f58a87`

変更:
- v0.61共通candidate fieldを追加
- A sourceをhostとして保持
- fixed corridor / E donorをdonor provenanceへ保持
- historical-source / deep-review-supported / promising-but-parse-needed等へreview statusを整理

CI:
- run `35431817371`
- conclusion: **success**

## v0.59 / v0.60 fixture
central:
- `data/generated-central-pivot-research-v59.json`
- drift check: success

scene:
- `data/generated-scene-microgrammar-v60.json`
- drift check: success

## 現在の実装上の到達点
研究generatorは2系統:
1. central-E-swap
2. scene-microgrammar

両方とも:
- deterministic
- CI検証あり
- fixtureあり
- common candidate schemaあり
- public UI未接続

## 次
最優先:
1. 第二positive scene familyを探す
2. v0.61 schemaでそのfamilyをgeneratorへ追加
3. positive familyが2系統以上になった後、modern怪文回文へのbridge設計へ進む

候補探索では、既存の春・草木 / 信仰 / 冬・雪 等から
- sceneが狭い
- seamが強い
- phrase attestationが高い
- negative controlが取れる
ものを優先する。

## 再開最短文
**「HANDOFF 25節から再開。全体約61%。v0.59/v0.60研究generatorはfixture+CI+v0.61共通schemaまで完成。次は第二positive scene family探索。」**


---

# 26. 2026-09-19 18:38 JST 第二positive family〜modern bridge公開統合チェックポイント

## 全体進捗目安
- 歴史回文研究・生成原理: **約84%**
- 怪文回文メーカー全体目標: **約72%**

研究原理は大半が出揃い、重心は「現代語generatorへの品質付き移植」と公開回帰へ移った。

## v0.62 第二positive family: なは outer-frame exchange

追加:
- `data/naha-outer-frame-exchange-v62.json`
- `docs/NAHA_OUTER_FRAME_EXCHANGE_V62.md`

対象trusted 2首:
- shoju-wakakusa「野遊」
- sendai-sakunami「作並」

共有:
- B=`なは`
- reverse(B)=`はな`
- v0.36 confidence=high
- transferable=true

operation:
- Aだけ交換
- B/C/D/Eはhost固定
- mirror側で第5句外枠も同時交換

結果:
- hybrid-018: promising / deep-review-supported方向
- hybrid-020: hold-semantic-role-mismatch

交換は意味的に非対称。

## v0.63 なは family generator

実装:
- `scripts/generate-naha-outer-frame-research.mjs`
- `data/generated-naha-outer-frame-v63.json`

fixture drift + CI成功済み。

代表成功run:
- Validate `35433865120`: success

## v0.64 repeated-B outer-frame survey

追加:
- `data/outer-frame-exchange-survey-v64.json`
- `docs/OUTER_FRAME_EXCHANGE_SURVEY_V64.md`

固定50のrepeated-B:
- なは: high stable positive
- また: source-specific review
- ほと: cross-scene + morphology hold
- きつ: scene-dependent

重要補正:
A-only outer-frame swapでは、global B transferabilityだけで禁止しない。
実際に動かした境界とsource-local contextを見る。
ただしglobal seam定義自体は変更しない。

## v0.65 historical → modern bridge contract

追加:
- `data/historical-modern-bridge-contract-v65.json`
- `docs/HISTORICAL_MODERN_BRIDGE_V65.md`

移植するもの:
- operation-specific validation
- scene gate
- semantic-role gate
- directional compatibility
- negative controls
- trace

移植しないもの:
- 歴史短歌本文そのもの
- 古語表記
- 31かな短歌meter強制

第一target:
- seam grammar

## v0.66 modern seam semantic-role matrix

追加:
- `data/modern-seam-role-matrix-v66.json`

frame:
- see
- loan

既存shellだけを使用し、新語は発明しない。

loan:
- person: pass
- animal: semantic pass / public layerは既存方針に合わせL2
- event: review-needed
- object/abstract: hold

## v0.67 modern seam bridge generator

実装:
- `scripts/generate-modern-seam-bridge.mjs`
- `data/generated-modern-seam-bridge-v67.json`

新規構造候補:
- total 13
- accepted 7
- review-needed 1
- hold-semantic-role 5

CI成功:
- run `35434128259`: success

## v0.68 human curation

追加:
- `data/modern-seam-bridge-curation-v68.json`

人手レビュー:
- accepted 7
- review-needed 1
- held 5

重要:
「確かにイカの会に貸した。」は、会を団体義に勝手に変更せずreview-needed維持。

## public重複検査

accepted 7件を
- seed
- DNA rules
- reverse-pair
- seam recipe
へ照合。

既存重複1件:
- `たしかににわのわににかした`
- 「確かに、庭のワニに貸した。」
- seed `V05-0065`
- rule `L1-TASHIKANI-LOAN`

これは研究上のpositive再発見例として残すが、public bridge追加から除外。

## v0.69 public whitelist

追加:
- `data/modern-bridge-public-v69.json`

真の新規:
- 6件
- L1=3
- L2=3

L1:
1. タミも庭のワニも見た。
2. タミも店のセミも見た。
3. タミも今朝の酒も見た。

L2:
1. 確かに店のセミに貸した。
2. 確かに家のエイに貸した。
3. 確かにリスのスリに貸した。

public validator:
- `scripts/validate-modern-bridge-public.mjs`
- strict palindrome
- curation一致
- excluded漏れなし
- seed/DNA/reverse-pair/seam全pool重複なし
- L1/L2 count

validator修復commit:
- `13782b3713f68f7d1b6efcb4f568edc2548b2072`
- run `35435285604`: success

loan+animalの公開layerを既存方針へ合わせるgenerator修正:
- `7b9f081db05d884f71e5f090dae017a51d4d8abf`
- run `35435293420`: success

## 公開UI v0.27 integration

index.html commit:
- `89826b886785133c9c91c25c3d06c15bfb7687c7`

変更:
- badge: `v0.27 / 研究由来DNA`
- `modern-bridge-public-v69.json` を読込
- `bridgePool()` 新設
- `seamPool()` に6件を合流
- 新ボタンなし
- 既存「継ぎ目型DNA」から利用
- 10本比較・実効候補数へ反映

UI validator追加:
- `d94d0f805ff7767ebd04d4d18b7fdf05ff82067e`
- Validate run `35435345530`: success
- Pages run `35435345531`: success

## 既存UI bug修復

公開前確認でJSが参照する
- `lengthMeta`
- `wrapMeta`

がHTMLに存在しないことを発見。

修復:
- `fc5d7a6d8fbfb049ee54acf19103692652cc7f97`
- Validate `35435369533`: success
- Pages `35435369544`: success

validatorにも存在検査を追加:
- `db7a22d77c5ac4752c96f7dae818f860a49af4e0`

bridge総括文書:
- `docs/MODERN_SEAM_BRIDGE_V66_V69.md`

## 固定事項

変更なし:
- historical fixed baseline = 50
- wave2 = verified14 / held5
- general-factor-crossover disabled
- 歴史短歌そのものはpublic候補に入れない
- machine automatic natural/accepted判定を最終判断にしない

## 次工程

1. 最新 `db7a22...` のValidate/Pagesを最終確認
2. 公開ページv0.27の静的確認
3. bridge 6件の露出頻度を評価
4. semantic-role matrixを第三frameへ拡張するか検討
5. growth-engineへ scene-compatible wrapper selection を移植
6. 最終的に「候補数」より「自然な怪文の生成率」を主要評価へ移す

## 再開最短文

**「HANDOFF 26節から再開。全体約72%。第二positive family（なは）とmodern seam bridge v0.66-v0.69を実装。公開v0.27へ6件をbridgePoolで限定統合済み。次は最新CI/Pages確認後、bridge露出頻度評価とgrowthへのscene/role gate移植。」**


---

# 27. 2026-09-19 品質ループ v0.70〜v0.80 チェックポイント

## 進捗目安
- 歴史回文研究・生成原理: **約85%**
- 怪文回文メーカー全体目標: **約78%**

歴史研究そのものより、公開generatorへ研究原理を移植して品質を測る工程へ重心が移った。

## v0.70 bridge exposure

追加:
- `data/public-bridge-exposure-policy-v70.json`

測定:
- L1 default bridge share: 約13.6%
- L2 default bridge share: 約23.1%

L2で新familyが強く出すぎるため、
一発の継ぎ目型DNA生成だけbridge drawを最大15%へ制御。

候補一覧・比較poolからは削除しない。

実装:
- `standardSeamPool()`
- `bridgePool()`
- `seamPool()`
- `seamOne()` で15% cap

CI/Pages:
- validator fix `29adb465cebb22c10681a7961133eb2aca81aa9d`
- Validate `35435504577`: success
- Pages `35435504589`: success

## v0.71 wrapper audit

追加:
- `data/growth-wrapper-audit-v71.json`

45 narrative family終端を監査。
一般sceneではauto_priorityだけで
say/hear/state/ask/narrate がほぼ固定top5になっていた。

ask-topic:
- 45 family中30 familyでtop5
- 宣言文にも自動適用

## v0.72 semantic-role gate

追加:
- `data/growth-wrapper-role-gate-v72.json`

自動選択rule:
- ask: 疑問表現のみ
- decide: 決定語彙のみ
- cause: 理由
- record-identity: 状況
- read/write/ack/tell/reply: 引用・伝聞
- reaction: 反応 + 引用・伝聞
- general report/cognition: broad fallback

reactionを引用・伝聞にも許可した理由:
quote-matsutakeはnoun collisionで通常wrapperが大量に消え、strict gateでは4候補まで減ったため。
引用内容への反応としてsemanticにも許容し、minimum poolを維持。

## v0.73 deterministic simulation

実装:
- `scripts/simulate-growth-wrapper-role-gate.mjs`
- `data/growth-wrapper-role-simulation-v73.json`

結果:
- families 45
- changed top5 34
- min eligible 8
- declarative ask top5 0
- non-quote specialized top5 0

CI:
- `35435646144`: success
- fixture lock `58d8f273b8d40a8ac2dc31e2f88dcfb3242beb7e`

## v0.74 public rollout

追加:
- `data/growth-wrapper-role-public-v74.json`

決定:
- **auto-selection only**

manual dropdownは従来どおりnoun-collisionのみで全wrapperを表示。

比較用quality ordinalでは:
- before 3.5422
- after 3.6667

weirdness floor:
- before 3.0711
- after 3.0533

## 公開 v0.28

index.html:
- badge `v0.28 / 研究由来DNA＋意味役割外枠`
- nounCompatibleSentenceWrappers()
- autoCompatibleSentenceWrappers()
- wrapperRoleAllowed()
- growthDimensionFor()

manualとautoを分離。

公開本体commit:
- `65b9196d46cb0da918d0e824998ff85662ce5733`

CI:
- Validate `35435750603`: success
- Pages `35435750665`: success
- rollout validator `35435764418`: success

## v0.75 quality metadata audit

追加:
- `data/public-quality-metadata-audit-v75.json`

全one-shot pool unique:
- 649
- palindrome failure 0

default:
- 635
- L1 492
- L2 60
- L3 83

重要限界:
DNAのjapanese_qualityはlayer由来が多いため、A比率を自然さ成功率として使えない。

## v0.76 fixed quality benchmark baseline

実装:
- `scripts/build-public-quality-benchmark.mjs`
- `data/public-quality-benchmark-v76.json`

source/layer層化50件。
v0.76は改善前baselineとして保存。

## v0.77 model-assisted pre-review

追加:
- `data/public-quality-first-pass-v77.json`

結果:
- keep 47
- review 2
- hold 1

問題:
- QB-021 今朝のキキの酒: L1には強引
- QB-042 声のエコを見る: semantic mismatch

人間評価ではなく診断用pre-review。

## v0.78 calibration

追加:
- `data/public-quality-action-plan-v78.json`

seam grammar補正:
- time-see-nana-child -> L2 / A- / weird4
- time-see-ishii -> L2 / A- / weird3
- time-see-kiki -> L2 / A- / weird3
- see-voice-eco -> L2 / B / weird4

根拠:
growth time-observationと同一/同構造の既存評価へ整合。
voice-ecoは削除せずdefault L2から外す。

seam data commit:
- `48f45c9b5ee4ee850962edd9360d5b87148cfd3c`

内部version:
- 0.28.1

## v0.79 post-calibration benchmark

追加:
- `data/public-quality-benchmark-v79.json`

v0.76との差:
removed:
- タミも今朝のキキの酒も見た。
- タミも声のエコも見た。

added:
- 井川もこのナナの子も若い。
- タミも今朝の石井の酒も見た。

builderをv79へ更新:
- `5cd7bfc29060f3e6d7ef2584ca3e79acde5aa392`
- Validate `35436021076`: success
- Pages `35436021086`: success

## v0.80 post-review

追加:
- `data/public-quality-post-review-v80.json`

48件はreading単位でv0.77評価を継承。
新規2件のみ一次レビュー。

結果:
- keep 49
- review 1
- hold 0

baseline比:
- keep +2
- review -1
- hold -1

CI:
- Validate `35436045725`: success
- Pages `35436045729`: success

総括:
研究原理 → 公開生成 → 露出制御 → 固定benchmark → 問題family特定 → データ補正 → 同条件再benchmark
という品質改善ループが初めて一巡した。

詳細:
- `docs/PUBLIC_QUALITY_LOOP_V70_V80.md`

## 次の主要課題

1. **display-reading fidelity v0.81**
   - 魚（うお/さかな等）
   - 高田（たかだ/たかた等）
   のように、表示漢字から想定readingが一意でない候補を監査。
2. L1 recursive kinship templateの反復率を定量化。
3. 固定benchmarkの最終人間判定を将来導入。
4. quality loopを壊さずsemantic-role generatorを追加拡張。

固定事項:
- historical fixed50変更なし
- wave2 verified14 / held5変更なし
- bridge public 6件
- bridge seam-one exposure cap 15%
- general-factor-crossover disabled

## 再開最短文

**「HANDOFF 27節から再開。全体約78%。公開v0.28、bridge6件+15%露出cap、growth wrapper role gate、v0.76→v0.79品質benchmark校正までCI成功。次はdisplay-reading fidelity v0.81。」**


---

# 28. 2026-09-19 公開バランス・非親族long-tail v0.81〜v0.91 チェックポイント

## 進捗目安
- 歴史回文研究・生成原理: **約86%**
- 怪文回文メーカー全体目標: **約83%**

今回は「候補を増やす」よりも、公開surfaceごとの偏りと読みの曖昧さを補正した。

## v0.81 / v0.82 display-reading fidelity

監査:
- 高田=たかた: 14 unique候補
- 魚=うお: 4 unique候補
- high risk合計18件

中リスク:
- 主=ぬし
- 種=たね
- 井川=いかわ

追加:
- `data/public-reading-fidelity-audit-v81.json`
- `data/public-reading-hints-v82.json`
- `scripts/validate-public-reading-hints.mjs`

公開:
- high-risk候補だけ `読み指定 高田＝たかた / 魚＝うお` pill
- sentence display/canonical readingは変更しない

CI coverage:
- takata 14
- uo 4
- total 18

## v0.83.1 kinship repetition audit

L1 DNA buttonを実装どおり再構成。

正確値:
- unique 451
- recursive kinship reading 216
- natural share 47.9%

初回v0.83の約7割推定はsource分類の粗い概算で過大だったため、v0.83.1で訂正済み。

## v0.84 one-shot DNA exposure

追加:
- `data/dna-kinship-exposure-policy-v84.json`
- `scripts/validate-dna-kinship-exposure.mjs`

公開L1 DNA一発抽選:
- recursive natural share 47.9%
- cap 25%

inventoryは451のまま。

## v0.85 / v0.86.1 10本比較

uniform比較pool:
- unique 489
- recursive reading 216
- share 44.2%
- uniform 10本の期待値 約4.4本

v0.86.1 L1 stratified:
- seed nonrecursive 3
- nonrecursive DNA 3
- recursive kinship 2
- seam + bridge nonrecursive 2

重要:
親族判定はsource labelではなくrecursive reading set membership。
seedに同readingがあってもquotaを迂回しない。

実装:
- `tenComparisonItems()`
- `takeRandomUnused()`
- `shuffleItems()`

validator:
- `scripts/validate-ten-comparison-balance.mjs`

正常pool:
- seed nonrecursive 139
- nonrecursive DNA 235
- recursive 216
- seam/bridge nonrecursive 19

## v0.87.1 non-kinship quote research

親族化前stage1:
- 馬もナナも舞う。
- 魚もナナも追う。
- ブヨもナナも呼ぶ。
- 種もナナも寝た。

4 family × 10 stage = 40 research stage。

v0.87.1:
- report-simple-* lane
- first wrapperを4 familyで分散
  - say-topic
  - narrate-topic
  - hear-kuki
  - tell-topic

既存18 fixed quoteの18-way first-wrapper diversityを壊さない。

追加:
- `data/nonkinship-quote-expansion-v87.json`
- `scripts/generate-nonkinship-quote-expansion.mjs`

## v0.88 curation

40段のうち:
- depth 0-5 = 24段 accepted
- depth 6-9 = 16段 held

heldは全てquality C / weirdness5。
研究fixtureには残すがpublic growthには入れない。

## v0.89 non-kinship reaction research

同じ4核へ既存reaction chain:
- cry
- troubled
- silent
- laugh

4 family × 5 stage = 20。

追加:
- `data/nonkinship-reaction-expansion-v89.json`
- `scripts/generate-nonkinship-reaction-expansion.mjs`

既存 reaction-light と同じwrapper chain。

## v0.90 public growth rollout

追加:
- `data/nonkinship-growth-rollout-v90.json`
- `scripts/validate-nonkinship-growth-rollout.mjs`

growth-engine:
- internal version 0.31

追加:
- report-simple-* 4 family × 6 = 24 stage
- reaction-simple-* 4 family × 5 = 20 stage

合計:
- +8 family
- +44 stage

結果:
- narrative family 45 -> 53
- narrative stage 322 -> 366
- L1 13 family
- L2 40 family
- 引用・伝聞 18 -> 22
- 反応 3 -> 7

親族stage:
- 216のまま

親族stage share:
- 67.1% -> **59.0%**

legacy fixed quote:
- 18 family維持
- first-wrapper diversity 18維持

## v0.91 role gate post-rollout

追加:
- `data/growth-wrapper-role-simulation-v91.json`

53 familyで再検証:
- min gated pool 8
- changed top5 42
- declarative ask top5 0
- non-quote specialized top5 0

新規8 familyでもrole gateは正常。

## CI / Pages

途中、旧v0.73 fixtureと反応validatorのlog変数が原因で一時赤になったが修正済み。

最終:
- Validate `35438220984`: success
- Pages `35438220963`: success

詳細:
- `docs/PUBLIC_BALANCE_AND_GROWTH_DIVERSIFICATION_V81_V91.md`

## 固定事項

変更なし:
- historical fixed baseline = 50
- wave2 = verified14 / held5
- bridge public = 6
- bridge seam-one cap = 15%
- general-factor-crossover disabled
- v0.76 quality benchmark baselineは上書きしない

## 次工程

優先:
1. **L2 10本比較のsource-family偏重監査**
2. 53 familyになったgrowth選択UIの操作性監査
3. quality benchmark 50件の人間最終判定用フォーマット整備
4. 中リスクreading hint（主/種/井川）を出す必要があるか再評価

研究:
5. hybrid-002 deep review
6. Route A source-image verification

## 再開最短文

**「HANDOFF 28節から再開。全体約83%。公開v0.31、L1 DNA親族cap25%、10本比較を3/3/2/2層化、reading hint18件、growthを53 family/366段へ非親族diversifyし親族比59.0%。Validate/Pagesともgreen。次はL2比較偏重監査。」**


---

# 29. 2026-09-19 L2比較バランス v0.92〜v0.93 チェックポイント

## 進捗目安
- 歴史回文研究・生成原理: **約86%**
- 怪文回文メーカー全体目標: **約84%**

## v0.92 L2 comparison audit

L2 default comparison pool:
- unique 62
- seed 29
- DNA 11
- reverse pair 8
- seam 11
- bridge 3

最大単一family:
- 同定 13
- share 約21.0%
- uniform 10本で期待値 約2.10本

集中確率:
- 同定 >=2: 67.52%
- 同定 >=3: 34.80%
- 同定 >=4: 11.95%
- 同定 >=5: 2.65%

L1のrecursive 44.2%ほどの大規模偏重ではないため、全面層化は不要と裁定。

## v0.93 light cap

追加:
- `data/l2-ten-comparison-audit-v92.json`
- `data/l2-ten-comparison-policy-v93.json`
- `scripts/validate-l2-ten-comparison-policy.mjs`
- `docs/L2_COMPARISON_BALANCE_V92_V93.md`

公開UI:
- base samplingは従来どおりuniform without replacement
- family=`同定` が3本以上の時だけ最大2本へcap
- 超過分は未使用の非同定候補で補充

実装:
- `repairL2Comparison(items, combined)`
- `tenComparisonItems()` にL2分岐
- badge `v0.32 / 品質バランス比較`

変更なし:
- candidate inventory
- one-shot生成
- L1 v0.86.1 stratified comparison
- L3 uniform comparison

## CI / Pages

latest:
- Validate `35438410565`: success
- Pages `35438410553`: success

validator:
- pool 62
- 同定 13
- 非同定 49
- worst-caseでも10 unique / 同定<=2へ修復可能

## 次工程

1. **growth 53 familyの選択UI操作性監査**
2. dimension / family dropdownの情報密度・重複感を確認
3. family削除ではなくgrouping/filteringで整理
4. fixed50 quality benchmarkの人間最終判定フォーマット
5. 中リスクreading hintは保留

## 再開最短文

**「HANDOFF 29節から再開。全体約84%。L2比較は62候補中同定13件のみ軽い集中があり、uniform維持＋同定最大2本capをv0.93で公開。Validate/Pages green。次はgrowth 53 family選択UI監査。」**


---

# 30. 2026-09-19 growth UI・人間品質評価 v0.94〜v0.98 チェックポイント

## 進捗目安
- 歴史回文研究・生成原理: **約86%**
- 怪文回文メーカー全体目標: **約85%**

## v0.94 growth selector usability audit

53 narrative familyをUI観点で監査。

L1:
- 13 family
- 4 dimension
- 最大dimension 関係=6

L2:
- 40 family
- 8 dimension
- 引用・伝聞=22
- 反応=7
- 出来事=6

発見:
1. L2で `同段階で別案` が有効表示なのに、`growAgain()` 冒頭のL1限定returnで無反応。
2. L2/allは40 familyがflat select。
3. dimension選択後もfamily labelに同じdimensionが重複表示。
4. dimension件数が見えない。
5. familyごとの段数が見えない。

追加:
- `data/growth-selector-usability-audit-v94.json`

## v0.95 growth selector policy / public v0.33

追加:
- `data/growth-selector-usability-policy-v95.json`

公開UI:
- badge `v0.33 / 長文化ナビ整理`
- dimension labelに件数
  - 例 `すべて (40)`
  - `引用・伝聞 (22)`
- dimension=all時はfamily selectをoptgroup化
- family labelから冗長なdimension prefixを除去
- family labelに段数を追加
- family repopulate時、まだ有効なら現在選択を保持
- `同段階で別案` はnarrativeならL1/L2両方で有効
- structural rerollは従来どおりL1限定
- 同stageを持つ別familyがない時はreroll buttonをdisable

family/stage data自体は不変:
- 53 family
- 366 stage

本体commit:
- `3e7065fd4917d01befc606b7a1a3bbc10755743c`

UI validator:
- `303d174cf2474fde1b6591ff70e71d9a6a888817`
- Validate `35438583579`: success
- Pages `35438583592`: success

## v0.96 blind human review form

追加:
- `data/public-quality-human-review-blind-v96.json`

v0.79 fixed50から50件。

blindで見せる:
- review_id
- display
- canonical_reading

伏せる:
- source
- layer
- japanese_quality
- weirdness
- model review

評価軸:
- grammar: pass / marginal / fail
- semantic_coherence: clear / strained / opaque
- display_reading_fidelity: pass / hint-needed / mismatch
- productive_value: expand / keep-only / hold
- overall_naturalness: 1〜5
- confidence

## v0.97 post-blind adjudication ledger

追加:
- `data/public-quality-human-adjudication-v97.json`

blind完了後だけcurrent product metadataをunblind。

裁定:
- keep-current
- promote-layer
- demote-layer
- hold
- display-fix
- reading-hint
- metadata-only

モデルv0.80はhuman review後の補助情報のみ。

validator:
- `scripts/validate-human-quality-review.mjs`

CI:
- Validate `35438654255`: success
- Pages `35438654248`: success

文書:
- `docs/HUMAN_QUALITY_REVIEW_PROTOCOL_V96_V97.md`

## v0.98 medium-risk reading hint hold

中リスク:
- 主=ぬし → QB-038
- 種=たね → QB-034, QB-036
- 井川=いかわ → QB-022

追加:
- `data/medium-reading-hint-hold-v98.json`

裁定:
- 現在はmetadata-only
- explicit pillは出さない
- v0.96 human blind reviewで `display_reading_fidelity=hint-needed/mismatch` が出た場合だけ昇格検討

高リスクhintは従来どおり2語のみ:
- 高田=たかた
- 魚=うお

human-review validatorにv0.98 review ID連携も追加。

## 次工程

公開側の大きな既知課題はかなり整理済み。

次は研究側へ戻し、優先順:
1. hybrid-002 deep review
2. Route A source-image verification再試行
3. historical generatorの次のpositive family探索
4. 人間がv0.96を記入した場合はv0.97 adjudicationへ進む

固定事項:
- fixed50変更なし
- wave2 verified14 / held5変更なし
- v0.76 baseline不変
- medium hintはhuman review待ち

## 再開最短文

**「HANDOFF 30節から再開。全体約85%。公開v0.33でgrowth 53 familyをoptgroup/件数/段数表示へ整理しL2 reroll無反応を修正。v0.96 blind human review + v0.97 adjudication基盤を追加。中リスクreading hintはv0.98で人間判定待ち。次はhybrid-002 deep review。」**


---

# 31. 2026-09-19 20:01 JST 一時停止チェックポイント

## 停止時点

ここで作業を一時停止する。
実装・研究内容の詳細は直前の **30節（v0.94〜v0.98）** を正本とする。

進捗目安:
- 歴史回文研究・生成原理: **約86%**
- 怪文回文メーカー全体目標: **約85%**

公開側の主要整備:
- public UI: v0.33
- growth: 53 family / 366 stage
- L1 DNA recursive kinship抽選cap: 25%
- L1 10本比較: 3/3/2/2層化
- L2 10本比較: 同定family最大2本cap
- high-risk reading hint: 高田=たかた / 魚=うお
- medium-risk reading hint: v0.98でhuman review待ち
- blind human quality review: v0.96
- post-blind adjudication ledger: v0.97

研究側の固定事項:
- historical fixed baseline = 50
- wave2 = verified14 / held5
- bridge public = 6
- general-factor-crossover disabled
- v0.76 quality benchmark baselineは上書きしない

## CI / Pages

停止直前に確認した最新コード系CI:
- Validate run `35438708817`: **success**
- head `72c5933a5244abb42b08b8db521b7139a80dad6b`

最新checkpoint Pages:
- Pages run `35438725505`: **success**
- head `0ff2c0a99efc66cba3956d1ae3a81520fdd0558a`

既知の未解決エラーはない。

## 次回の優先順位

1. **hybrid-002 deep review**
2. Route A source-image verification再試行
3. historical generatorの次positive family探索
4. v0.96に人間評価が入った場合はv0.97 adjudicationへ進む

新たな公開機能追加より、まず研究側へ戻る。

## 再開最短文

**「HANDOFF 31節から再開。全体約85%。公開v0.33・growth 53 family/366段・比較/露出/reading hint/人間評価基盤まで安定。最新コードCI green。次はhybrid-002 deep review。」**


---

# 32. 2026-09-19 hybrid-002 deep review — normalization collision 発見

## 結論

31節から再開し、最優先の **hybrid-002 deep review** を実施した。

従来:
- v0.55: `promising-but-source-parse-needed`
- v0.56: `review-needed`
- v0.57/v0.59: `deep-review-needed-role`

今回の再判定:
- **`hold-morphology-normalization-collision`**

semantic-role より前の morphology gate へ差し戻す。

詳細:
- `docs/HYBRID_002_DEEP_REVIEW_V99.md`
- `data/hybrid-002-deep-review-v99.json`

## 決定的な発見

`shoju-five-elements` の D=`みつ` は、
trusted data 上の元読みでは **`みづ`（水）** であり、
回文判定用の normalization で `みつ` になっている。

一方 `shoju-068` は山内翻刻転写が
**`みつの世の`** であり、D の morphology は未確定。

したがって:
- normalized D は両方 `みつ`
- しかし pre-normalization reading / morphology identity は同一と確認されていない

v0.34/v0.59 が normalized `sample.D` だけで repeated-D group を作ったため、
normalization collision が起きた。

これは v0.58 の `raw_kana_node_merge_forbidden` と衝突する。

## hybrid-017 への波及

逆向きの hybrid-017 も同じ D 同一視に依存するため、
current pipeline では morphology gate で先に止める。

ただし v0.56 の「五大列挙を壊す」という role-negative は、
旧pipelineの研究fixtureとして保存する。

## 固定方針

- v0.55〜v0.59 は当時の研究履歴として**書き換えない**
- v0.99 を correction overlay とする
- 今後 D node を共有するときは normalized kana 一致だけでは不可
- pre-normalization reading / morphology / source-specific parse を分離する
- 歌68の `みつ` を「三つ」と自動確定しない。仏教語として plausible でも source review 待ち

## 次の優先順位

1. **normalization-aware / source-sensitive D guard を generator に実装**
2. Route A source-image verification を再試行（とくに歌68）
3. corrected repeated-D universe を再計算
4. 次の positive family 探索

## 進捗目安

- 歴史回文研究・生成原理: **約87%**
- 怪文回文メーカー全体目標: **約85%**

進捗が大きく跳ねないのは、候補1件の昇格ではなく、
**生成器の誤結合を1種類発見して安全側へ戻した**ため。
これは候補数より生成原理の信頼性に効く更新である。


---

# 33. 2026-09-19 v1.00 morphology guard — generator修正

## 実施

32節の hybrid-002 deep review で判明した normalization collision を、
research generator の実行経路へ反映した。

追加:
- `data/central-pivot-morphology-guard-v100.json`
- `data/generated-central-pivot-research-v100.json`
- `docs/CENTRAL_PIVOT_MORPHOLOGY_GUARD_V100.md`

更新:
- `scripts/generate-central-pivot-research.mjs`
- `scripts/validate-corpus.mjs`

## generator の現在値

v0.59 historical snapshot:
- 12 candidate

v1.00 current guarded generator:
- **10 candidate**
- normalization collision で先に止める: **2**
  - hybrid-002
  - hybrid-017
- deep-review-supported: **2**
  - hybrid-016
  - hybrid-019
- scene mismatch hold: **8**

## 重要

v0.59データは書き換えていない。

旧研究:
- role-negative hybrid-017
- deep-review-needed hybrid-002

は、研究過程を再現するnegative / correction fixtureとして残る。

一方、現在の生成器は
**normalized D が同じだけでは cross-source node を共有しない。**

この区別を固定した。

## 次

1. CI / Pages確認
2. Route A source-image verification再試行（歌68を優先）
3. guarded universe で次のpositive family探索
4. source imageで歌68 D morphologyが明示できた場合だけ hybrid-002/017 reopenを検討

## 進捗目安

- 歴史回文研究・生成原理: **約88%**
- 怪文回文メーカー全体目標: **約86%**


---

# 34. 2026-09-19 20:17 JST v1.00 CI復旧チェックポイント

## 現在地

hybrid-002 deep review から、
normalization collision の発見と generator v1.00 guard 実装まで完了した。

主要コミット:
- v0.99 deep review: `13b79fa3469feaa4bb0bbd8684134d427af6bd63`
- v1.00 morphology guard: `7f133a9f921c89324c48529c7f16c1415d234e2d`
- validator syntax fix: `2d2cddadc2b79766ec469709b3986569ecdc9abf`

## CI

v1.00 実装直後:
- Validate run `35439616626`: failure
- 原因: `scripts/validate-corpus.mjs` のv0.99読込行に literal `\\n` が1箇所混入
- 研究ロジック / fixture 不整合ではない
- 同headの Pages run `35439616625`: success

修正後:
- Validate run `35439669508`: **success**
- Pages run `35439669461`: **success**
- head: `2d2cddadc2b79766ec469709b3986569ecdc9abf`

既知の未解決コードエラーはない。

## 現行 generator

- v0.59 historical snapshot: 12 candidate
- v1.00 current guarded universe: **10 candidate**
- normalization collision hold: hybrid-002 / hybrid-017
- deep-review-supported: hybrid-016 / hybrid-019
- scene mismatch controls: 8

## 研究上の重要更新

回文正規化keyと morphology node を分離する。

特に:
- `みづ（水）→みつ` の正規化
- 元から `みつ` と転写される別形態

を、normalized kana一致だけで同一Dとしない。

これは central-E-swap だけでなく、
今後の historical crossover 全体へ適用する原則とする。

## 進捗目安

- 歴史回文研究・生成原理: **約88%**
- 怪文回文メーカー全体目標: **約86%**

## 次

31節で定めた優先順位へ戻り、
次は **Route A source-image verification 再試行**。

優先対象:
1. shoju-068「釈教」の原資料/画像で `みつの世の` 周辺を確認
2. D=`みつ` の語義・形態を、画像から確認できる範囲と解釈を分離して記録
3. 確認不能なら v0.99 hold を維持し、次positive family探索へ進む


---

# 35. 2026-09-19 Route A shoju-068 source review v1.01 チェックポイント

## 実施

34節から Route A source verification を再試行し、shoju-068「釈教」の D=`みつ` を
**原画像 / 学術翻刻 / 語義解釈** の3層に分離して再監査した。

追加:
- `data/shoju-068-source-review-v101.json`
- `docs/SHOJU_068_SOURCE_REVIEW_V101.md`

コミット:
- data: `52fc0736d4f64b909411556d05fef7f033595502`
- doc: `3dd42eb393c539842eb9108910f915eb2ac0c078`

## 原画像レイヤ

国文学研究資料館 国書データベースで
`風車塵の言の葉` の書誌を特定した。

- 書誌ID: `100080596`
- 所蔵一覧上に画像View導線あり

ただし今回の実行環境では Mirador / IIIF の該当コマへ直接到達できず、
**原画像の字形確認済みとはしない**。

東京都立図書館の `廻文歌百首` も確認したが、
検索時点では画像なし / 画像取得中表示。

## 学術翻刻レイヤ

山内潤三
「廻文歌の限界と効用（下）―高野山釈教長歌を頂点として―」
（『密教文化』107号、1974-07-25、pp.1-38、DOI 10.11168/jeb1947.1974.107_1）
の翻刻を再確認。

翻刻凡例:
- 原文どおりを旨とする
- 字体は現行漢字・平仮名へ改める
- 仮名遣いの誤用は原則そのまま

歌68:
`釈教　品もなく ほとけのをしへ みつの世の つみへしをのけ とほくなもなし`

したがって山内翻刻レベルでは、
shoju-068 の D surface は **`みつ`** であり、`みづ` ではない。

## 語義・morphology レイヤ

新纂浄土宗大辞典「三世」は、
三世を過去・現在・未来の「三つの世」と説明する。

歌68は:
- 題 = 釈教
- 直前 = ほとけのをしへ
- 問題箇所 = みつの世の

であるため、語義・統語上は
**`三つ + の + 世`**
と読む解釈が強く支持される。

ただしこれは原画像の字形を `三つ` と復元したという意味ではない。
source-image evidence と linguistic interpretation は今後も分離する。

## hybrid-002 / hybrid-017 の裁定

比較:

shoju-five-elements:
- pre-normalization `みづ`
- lexeme = 水
- normalized D = `みつ`

shoju-068:
- scholarly transcription = `みつ`
- strongly supported interpretation = 三つ
- normalized D = `みつ`

よって両者は palindrome key では一致しても、
morphology identity は共有しない。

現行扱い:
- hybrid-002: `hold-morphology-non-equivalence-supported`
- hybrid-017: `hold-morphology-non-equivalence-supported`
- reopen = false
- v1.00 guard 維持
- current generator = 10 candidate のまま
- positive = hybrid-016 / hybrid-019 のまま

整合性点検:
- v1.01 JSON parse: pass
- source_image_verified = false
- scholarly_transcription_verified = true
- automatic_reopen_allowed = false
- v1.00 generator に hybrid-002 / 017 が含まれないことを再確認
- v1.00 guard の blocked IDs も 002 / 017 のまま

## 研究原則の更新

今回、次をより明確に固定した。

**source glyph / transcription surface / linguistic morphology / palindrome-normalized key を別レイヤとして保持する。**

特に
`みづ（水）→みつ`
と
`みつ（三つ と強く解釈される形）`
を、回文key一致だけで同一nodeへ統合しない。

## 進捗目安

- 歴史回文研究・生成原理: **約89%**
- 怪文回文メーカー全体目標: **約87%**

## 次

Route A の歌68は、原画像字形のみ未確認として追補待ちにし、
研究上のblocking decisionは十分安全側に固定できた。

次の優先:
1. guarded universe で次positive historical family探索
2. source-image該当コマに到達できる環境が得られた場合のみ歌68字形を追補
3. general-factor-crossover は引き続き disabled
4. v0.96 human review入力があれば v0.97 adjudication

## 再開最短文

**「HANDOFF 35節から再開。Route Aでshoju-068歌68の山内翻刻『みつの世の』を再確認。原画像字形は未確認のまま分離保持。語義上は三つ＋の＋世が強く支持され、水（みづ→みつ）とはmorphology非同一。hybrid-002/017はreopenせず、current generator10件を維持。次はguarded universeの次positive family探索。」**


---

# 36. 2026-09-19 第三positive family探索 v1.02〜v1.04 チェックポイント

## 実施概要

35節から、guarded historical universe で第三positive family探索へ進んだ。

今回の結論は二段階。

1. B=`また` spring/plants outer-frame lane は positive化せず、negative regressionとして固定
2. D=`むす` source-specific corridor の **hybrid-007** を第三family最有力候補として研究generatorへ固定

ただし hybrid-007 はまだ
`promising-but-parse-needed`
であり、第三positive family **確定**とはしない。

詳細:
- `docs/THIRD_FAMILY_SEARCH_V102_V104.md`

## v1.02 B=また morphology review

追加:
- `data/mata-outer-frame-morphology-review-v102.json`

commit:
- `085fb015ff2bea3f1dd3b7636490fd202ef91b8c`

対象:
- shoju-001-komatsuhiki
- shoju-010-somokuka
- hybrid-001
- hybrid-012

山内翻刻・語彙分析では、
草木花の `またるる` は **待た(るる)** と明示される。

一方、小松引は `またひけ` と表出し、
近接述語 `引け` は確認できるが、
B=`また` 自体を草木花と同じ 待た- morphology と確定する根拠は不足。

したがって:
- same raw B = true
- morphology equivalence confirmed = false
- morphology non-equivalence proven = false
- B=また global transferable = false
- hybrid-001 / hybrid-012 = `hold-source-specific`

重要:
**「違うと断定」ではなく、「同じと確認できないので結ばない」。**

v1.00 `みつ` guardと独立したB-slot regressionとして保存する。

## v1.03 D=むす family review

追加:
- `data/musu-moon-family-review-v103.json`

commit:
- `35acd954a457b1a45779b953b79b06f91196b6ed`

host:
- shoju-add-109「嫁娘見月」

固定corridor:
- B=`きつ`
- C=`るみそらは`
- D=`むす`
- E=`めよめ`

D=`むす` は v0.51/v0.52 の source-specific ruleを維持。
BC/CD/DEがshoju-add-109由来である場合だけreview可能。
global seamへは昇格しない。

### hybrid-007

reading:
`なかきよのきつるみそらはむすめよめすむはらそみるつきのよきかな`

outer frame donor:
- shoju-038「田毎月」

既存scene evidence:
- `なかきよの` = 長き夜の（human-tentative / time）
- `つきのよきかな` = 月の良きかな（human-tentative / celestial + evaluation）
- host側は題「嫁娘見月」、翻刻中に みそら / 見る / 月 / 夜

裁定:
- structure: pass
- local attestation: pass
- source-specific morphology corridor: pass
- scene: review-pass
- semantic role: compatible-tentative
- final: **`promising-but-parse-needed`**

未解決:
1. `来つるみそらは` の厳密な統語
2. `すむはらそ見る` の厳密な語彙・統語

この2点が残るため deep-review-supported へは上げない。

### controls

hybrid-003:
- sea outer frame
- host family/sky/moon corridorとのscene mismatch
- `hold-scene-mismatch`

hybrid-014:
- donor shoju-035 の A=`はれつみよ` semantics が v0.49 で unresolved
- `hold-source-confirmation`

## v1.04 deterministic generator

追加:
- `data/generated-musu-moon-outer-frame-v104.json`
- `scripts/generate-musu-moon-outer-frame-research.mjs`

commits:
- fixture: `e8dc1cf23bfcf61fcc5ed80d9c9f7f6bc83152e0`
- generator: `8c9b94fb974c74ff74a412ce20c6bbfaf261259e`

output:
- shoju-add-109 historical source
- hybrid-007 promising-but-parse-needed
- hybrid-003 hold-scene-mismatch
- hybrid-014 hold-source-confirmation

invariants:
- host B/C/D/E fixed
- A only moves
- D=むす source-specific
- strict 31-kana palindrome
- 5/7/5/7/7
- accepted/natural machine status禁止
- common schema v0.61
- frozen fixture drift check

## validator / CI

`scripts/validate-corpus.mjs` を更新し、
v1.01〜v1.04 の安全条件・status・candidate setを検査。

commit:
- `9cf128d27ec74b1a75c60afec3ed3ccf7553002e`

workflowへ専用step追加:
- `node scripts/generate-musu-moon-outer-frame-research.mjs --check`

commit:
- `fe4d8825a4cb1002aec58321470cb178f99d43ac`

Validate:
- run `35442541085`
- conclusion: **success**
- head: `fe4d8825a4cb1002aec58321470cb178f99d43ac`

専用step:
- **Validate musu moon outer-frame generator: success**

同runで既存の
- corpus
- central-pivot
- scene microgrammar
- naha outer-frame
- modern bridge
- growth / quality / UI validators

もすべてsuccess。

途中のrun `35442536862` がcancelledだが、
これは連続push時のworkflow concurrency cancelであり、
後続headのrun `35442541085` がsuccessしている。

docs:
- `docs/THIRD_FAMILY_SEARCH_V102_V104.md`
- commit `f27bb608ea0f2790d36eb990c5088ce9a667b370`

latest Pages:
- run `35442621562`
- conclusion: **success**
- head: `f27bb608ea0f2790d36eb990c5088ce9a667b370`

## 現在のfamily状態

確立済み positive:
1. autumn-night-garden-moon
2. naha-spring-plants

candidate:
3. **musu-night-sky-family-moon**
   - best novel = hybrid-007
   - status = `third-positive-family-candidate-not-yet-established`

automatic acceptance:
- 0

general-factor-crossover:
- disabled 継続

## 研究上の更新

今回さらに次を固定した。

1. raw kana equalityだけではsource間morphology nodeを共有しない
2. source-specific seamは、corridorを保つ操作なら研究利用できる
3. source-specific利用はglobal transfer昇格を意味しない
4. sceneが通っても統語未解決ならpositive確定へ進めない
5. positive候補と同時にscene/source-parse negative controlをfixture化する

## 進捗目安

- 歴史回文研究・生成原理: **約90%**
- 怪文回文メーカー全体目標: **約88%**

## 次

最優先:
1. hybrid-007 syntax deep review
   - `来つるみそらは`
   - `すむはらそ見る`
2. 独立転写・原画像・信頼できる語釈で確認できれば第三family昇格可否を判断
3. 確認できない場合は無理に昇格せず別family探索へ移る
4. historical fixed50 / wave2 verified14-held5 / public bridge6 / v0.76 baselineは変更しない

## 再開最短文

**「HANDOFF 36節から再開。B=またはv1.02でsource-specific morphology hold。D=むす corridorではhybrid-007を第三family最有力としてv1.03 review、v1.04 deterministic generator+fixture+CIまで完成。hybrid-007はpromising-but-parse-neededで、未解決は『来つるみそらは』『すむはらそ見る』。Validate run 35442541085 green。次はこの2箇所のsyntax deep review。」**


---

# 37. 2026-09-19 hybrid-007 syntax v1.05 / wave2 travel prospect v1.06 チェックポイント

## 実施概要

36節から hybrid-007 の syntax deep review を継続した。

結論:
- hybrid-007 は **promising-but-parse-needed 維持**
- deep-review-supported へ昇格しない
- third positive family はまだ確立しない

そのうえで alternate family を探索し、
wave2 verified の旅行歌 90 / 93 に
B=`まは` を共有する新しい A-only outer-frame prospect を発見した。

ただしこちらも source-confirmation 前なので、
positive familyへは昇格せず research prospect として固定した。

## v1.05 hybrid-007 syntax deep review

追加:
- `data/hybrid-007-syntax-deep-review-v105.json`
- `docs/HYBRID_007_SYNTAX_DEEP_REVIEW_V105.md`

commits:
- data: `a361f61ef1b16a8aba799697852c14559aa2a9e6`
- doc: `a08c8a5d6caf32e10031df9fd3b9722aaa8e0e44`

対象:
1. `来つるみそらは`
2. `すむはらそ見る`

### 来つるみそらは

外部文法・辞書レベルでは:
- 完了助動詞「つ」の連体形 `つる` は成立
- `御空 / みそら` も語として成立

したがって
`来 + つる + 御空 + は`
という形態分析自体は可能。

しかしこの歌において、
`来つる` が `御空` へどう係るかを
直接支持する原画像・校訂注・独立語釈は得られなかった。

判定:
- morphology: formally possible
- source-specific syntax: unresolved
- promotion: no

### すむはらそ見る

`すむ` は:
- 住む
- 澄む

をkanaだけで一意に選べない。

また Yamauchi-derived transcription surface は
`そ`
であり、
`ぞ`
とは確認されていない。

文法的にきれいになるからという理由で
`そ → ぞ`
と補い、係り結びを成立させるのは禁止。

さらに `見る` は上一段で
終止形 / 連体形が表面上同形なので、
`見る` の形から逆に `ぞ` を確定することもできない。

判定:
- lexeme: ambiguous
- voicing: unresolved
- syntax: unresolved
- promotion: no

### 新安全規則

`source-voicing-and-lexeme-ambiguity-guard`

以下を分離する:
1. source glyph
2. scholarly transcription surface
3. normalized palindrome reading
4. voicing hypothesis
5. lexeme hypothesis
6. syntax hypothesis

**自然な文法を得るためだけに濁点・漢字・lexeme・係り結びを復元しない。**

## v1.06 wave2 travel B=まは prospect

追加:
- `data/wave2-travel-maha-outer-frame-prospect-v106.json`
- `docs/WAVE2_TRAVEL_MAHA_PROSPECT_V106.md`

commits:
- data: `f1d9dbd396bc72ed998c5557dfdc729500bd2c5b`
- doc: `b40c0b940a5b91e68dd3bcd01e039e493f185975`

対象:
- `shoju-next-090`「旅行の人々え」
- `shoju-next-093`「旅行（同）」

両方とも wave2 verified-audio-string-pending-integration。
fixed50 へは統合しない。

### source 90

factor:
- A=`ともかくも`
- B=`まは`
- C=`るなかたひ`
- D=`きよ`
- E=`くゆく`

ku2:
`まはるなかたひ`

### source 93

factor:
- A=`やとちかく`
- B=`まは`
- C=`るなりいま`
- D=`みか`
- E=`きよき`

ku2:
`まはるなりいま`

### B morphology

両sourceで B+C が
**`まはる…`**
と続く。

辞書上 `まはる` は歴史的語形として成立し、
ラ行四段の「回る / 廻る」として
めぐる・あちこち歩く等の意味を持つ。

したがって、
raw B=`まは` 一致だけよりは
forward morphology compatibility の根拠が強い。

ただし:
- source glyph未確認
- 原文漢字を回る/廻ると確定しない
- reverse(B)=`はま` を浜と確定しない

### operation-specific correction

A-only outer-frame swapでは:
- host B/C/D/E固定
- donor Aのみ移動
- generated ku5 outer frame = donorの reverse(B)+reverse(A)

となる。

したがって donor ku5外枠がそのまま実証されるため、
reverse(B)=`はま` のlexemeをglobalに復元・共有しなくても
operation-specificな局所実証は保てる。

これは v0.64 の
「動かした境界だけ評価する」
原則をwave2でも再確認する例になる。

### novel prospects

90 host <- 93 outer:
`やとちかく / まはるなかたひ / きよくゆく / よきひたかなる / はまくかちとや`

93 host <- 90 outer:
`ともかくも / まはるなりいま / みかきよき / かみまいりなる / はまもくかもと`

両方:
- strict palindrome: pass
- 5/7/5/7/7: pass
- local overlap attestation: pass
- morphology: conditional-pass-operation-specific
- scene: source title「旅行」レベルで一致
- semantic role: review-needed
- source confidence: hold

status:
`hold-source-confirmation`

automatic acceptance:
0

positive family established:
false

## validator / CI

`scripts/validate-corpus.mjs` に v1.05 / v1.06 の検査を追加。

検査:
- hybrid-007 statusがpromising-but-parse-neededのまま
- third family未確立
- PDF/source-imageを直接確認したと誤記しない
- `そ/ぞ` voicing unresolvedを維持
- v1.05 safety guard存在
- fixed50不変
- wave2 verified14 / held5不変
- B=`まは` / reverse B=`はま` 固定
- reverse B lexeme unresolved
- v1.06 2候補ともstrict palindrome
- meter 5/7/5/7/7
- review statusはhold-source-confirmation
- automatic acceptance 0

validator commit:
`226bfbc73b814202a660e1d03b99095c40f1d6f8`

Validate:
- run `35443791622`
- conclusion: **success**
- head: `226bfbc73b814202a660e1d03b99095c40f1d6f8`

既存generator / bridge / growth / UI validatorも同runでsuccess。

## 現在のfamily状態

確立済みpositive:
1. autumn-night-garden-moon
2. naha-spring-plants

strongest unresolved candidate:
3. musu-night-sky-family-moon
   - hybrid-007
   - promising-but-parse-needed

new alternate prospect:
4. wave2-travel-maha
   - 2 directed prospects
   - both hold-source-confirmation
   - positive family not established

## 研究上の現在地

今回の重要点は候補数ではなく、
**曖昧な史料を自然な文法へ寄せる補正を禁止しつつ、
operation-specificに必要な証拠だけで候補空間を前進させられたこと。**

固定事項:
- fixed50変更なし
- wave2 verified14 / held5変更なし
- v0.76 baseline変更なし
- public bridge6変更なし
- general-factor-crossover disabled
- research-only prospectをpublicへ接続しない

## 進捗目安

- 歴史回文研究・生成原理: **約91%**
- 怪文回文メーカー全体目標: **約89%**

## 次

優先:
1. source 90 / 93 の原画像または明示的な学術転写・語釈を探索
2. B=`まは` のsource morphologyとouter-frame全文を確認
3. 得られなければwave2の他のsame-scene repeated seamを同じguardで探索
4. hybrid-007は新証拠が出るまでpromising-but-parse-neededで凍結
5. v0.96 human review入力があればv0.97 adjudication

## 再開最短文

**「HANDOFF 37節から再開。hybrid-007はv1.05でpromising-but-parse-needed維持、そ→ぞ等の自然化補正を禁止するsource-voicing guardを追加。wave2旅行90/93は両方B+Cが『まはる…』で、B=まはのoperation-specific morphologyが有望。v1.06で2候補をhold-source-confirmationとして固定。Validate run 35443791622 green。次は90/93のsource確認。」**


---

# 38. 2026-09-19 wave2 repeated-seam survey v1.07 / travel generator v1.08 チェックポイント

## 実施概要

37節から、wave2旅行90/93のsource確認を継続した。

原画像そのものには今回も到達できなかったため、
v1.06 `hold-source-confirmation` は解除していない。

そのうえで、
fixed50 + wave2 verified14 を discovery level で再走査し、
旅行90/93が本当にwave2最優先familyかを検証した。

結論:
- wave2で新しく生じる repeated seam のうち、
  **新規交換 + 同一題群** を満たすのは B=`まは` の旅行90/93だけ
- したがって travel lane の優先順位を全体走査で追認
- positiveへは昇格せず deterministic research generatorへ固定

詳細:
- `docs/WAVE2_REPEATED_SEAM_SURVEY_V107_V108.md`

## v1.07 repeated-seam survey

追加:
- `data/wave2-repeated-seam-survey-v107.json`

commit:
- `44c92069a92c06d5c39ee18653b284fbc3874579`

### repeated B

wave2関与群は6:

- B=せか
  - 地水火風空 duplicate/parallel
  - noveltyなし

- B=なか
  - 伊勢参宮 duplicate/parallel
  - noveltyなし

- B=なみ
  - 水辺梅 / 東西南北
  - cross-scene hold

- B=きつ
  - fixed autumn/moon family + wave2 大和廻
  - wave2追加は新しいsame-scene positiveを作らない

- B=いつ
  - 鶴 / 待恋 / 無常 / 旅行
  - heterogeneous cross-scene

- **B=まは**
  - 90「旅行の人々え」
  - 93「旅行（同）」
  - **same-title-family-novel**
  - best-wave2-outer-frame-prospect

両sourceのB+C:
- 90: `まはるなかたひ`
- 93: `まはるなりいま`

raw B一致だけでなく、
forward `まはる` surfaceまで共有する。

### repeated D

wave2関与群は6:
- D=みな
- D=みつ
- D=いま
- D=きよ
- D=ひと
- D=かわ

結果:
- duplicate / no E novelty
- v1.00 morphology guard
- cross-scene

のいずれかで、
new same-scene positive laneなし。

## source access audit

複数の物理所蔵ルートを確認。

### 国書DB / 大阪大学附属図書館 忍頂寺文庫

『風車塵の言の葉』
- BID: `100080596`
- holder call no.: `C-38`
- film call no.: `228-0019-014`
- 画像一覧にView導線あり

ただし該当フレームを直接検査できず。

### 東京都立図書館

『廻文歌百首』
- 加07316
- web上: 画像取得中 / 画像なし

### 大阪公立大学 杉本図書館

CiNii Books所蔵:
- `911.158//SHO//MORI J-6984`

### 東北大学 狩野文庫

catalog:
- `4468 風車塵の言の葉 1 笑寿`

いずれも今回の該当丁画像直接確認には至らない。

したがって:
- physical-witness routes = multiple
- direct image inspection = false
- source-image claim = しない

## v1.08 travel deterministic generator

追加:
- `data/generated-wave2-travel-outer-frame-v108.json`
- `scripts/generate-wave2-travel-outer-frame-research.mjs`

commits:
- fixture: `e9693d0315a324bbccf4fe1aab5819cf88a2a8f3`
- generator: `3ada149372ee3dbde7562c39c9699609bce8d415`

candidate 4件:

historical source members:
1. shoju-next-090
2. shoju-next-093

novel:
3. wave2-travel-090-host-093-outer
4. wave2-travel-093-host-090-outer

### invariants

- operation = shared-B-outer-frame-swap
- changed factor = A only
- host B/C/D/E fixed
- B=`まは`
- forward B+C = hostの `まはる...`
- reverse B=`はま`
- reverse B lexeme = unresolved
- reverse Bを「浜」等へ自動復元しない
- global B transferabilityはassertしない
- strict palindrome
- meter 5/7/5/7/7
- fixed50不変
- wave2はpending integrationのまま
- novel 2件 = `hold-source-confirmation`
- accepted / natural / deep-review-supported をmachineが出さない

common schema v0.61 required fieldsも付与済み。

## validator / CI

validator更新:
- commit `d2cd25384ec7bd2ca7d1c4c86c019a7354f63de0`

workflow更新:
- commit `fd03db97802d5d5776f4027a4864abdad3bf9c14`

専用step:
`node scripts/generate-wave2-travel-outer-frame-research.mjs --check`

Validate:
- run `35444301341`
- head `fd03db97802d5d5776f4027a4864abdad3bf9c14`
- conclusion: **success**

同runで:
- corpus
- central pivot
- scene microgrammar
- naha outer-frame
- musu moon outer-frame
- modern bridge
- public whitelist
- growth
- quality
- UI

もすべてsuccess。

docs commit:
- `8a81a2c3c4e92f1af993dfc95b6f5e3391c83294`

## 現在のfamily状態

確立positive:
1. autumn-night-garden-moon
2. naha-spring-plants

strong unresolved:
3. musu-night-sky-family-moon
   - hybrid-007
   - `promising-but-parse-needed`

best wave2 prospect:
4. wave2-travel-maha
   - 2 directed novel swaps
   - both `hold-source-confirmation`

第三positive familyはまだ増やさない。

## 研究上の更新

今回の重要点:

1. wave2候補を個別intuitionではなく repeated-seam全体走査で比較した
2. 旅行90/93が唯一のnew same-title repeated-B laneと確認
3. source imageが取れなくても、候補・hold理由・未解決lexemeをdeterministic fixtureへ固定
4. reverse seamの漢字復元をgenerator要件にしないoperation-specific設計を維持
5. wave2 research use と fixed50 integration を分離

固定事項:
- fixed50変更なし
- wave2 verified14 / held5変更なし
- public bridge6変更なし
- v0.76 baseline変更なし
- general-factor-crossover disabled
- research-only familyをpublicへ接続しない

## 進捗目安

- 歴史回文研究・生成原理: **約92%**
- 怪文回文メーカー全体目標: **約90%**

## 次

優先:
1. travel 90/93 source image / annotated transcription探索継続
2. 得られなければ、surface transcriptionだけで断定せず全文syntaxのsafe review
3. source confidenceが上がらなければtravel familyはv1.08 fixtureで凍結
4. 次は別operation候補を探索
5. hybrid-007は新証拠までpromising-but-parse-neededで凍結
6. v0.96 human review入力があればv0.97 adjudication

## 再開最短文

**「HANDOFF 38節から再開。v1.07でfixed50+wave2 repeated seamを全走査し、新規same-title laneは旅行90/93のB=まはだけと確認。原画像は複数所蔵ルートまで確認したが該当丁未読なのでhold継続。v1.08で4件のdeterministic generator/fixtureを実装し、novel2件はhold-source-confirmation固定。Validate run 35444301341 green。次は90/93 source確認、不可ならsafe syntax review→別operation探索。」**


---

# 39. 2026-09-20 v1.09〜v1.14 source-confirmation / operation-saturation チェックポイント

## 実施概要

38節から以下を実施した。

1. travel 90/93 source-safe syntax review v1.09
2. fixed50 minimum-operation audit v1.10
3. fixed50 + wave2 factor-graph audit v1.11
4. 山内論文のpoem-specific可読転写を再取得 v1.12
5. travel family deep syntax review v1.13
6. current deterministic travel generator v1.14

最大の更新は二つ。

- **operation不足ではなくsource coverage / source confirmationが現在のbottleneck**と機械監査で確認
- 旅行90/93は山内の該当歌転写を直接読めるようになり、best directionが
  `hold-source-confirmation` から
  **`promising-but-parse-needed`**
  へ進んだ

第三positive familyそのものはまだ確定しない。

## v1.09 travel syntax source review

追加:
- `data/wave2-travel-syntax-source-review-v109.json`
- `docs/WAVE2_TRAVEL_SYNTAX_SOURCE_REVIEW_V109.md`

commits:
- data `96fa661a5038ca9e14e151cd2bf517e0527d25dc`
- doc `4bb33395e528e210faf2500e22fc3147861bcb63`
- validator `0d497e4a46943122a18b788acd9b542958e93bf7`

Validate:
- run `35469932928`
- success

同作者・笑寿の「高野山釈教長歌」から:
- `参るなかたひ` → 長旅
- `よき日たかなる` → 佳き日髙なる

というparallelを確認。

これで90番の:
- `なかたひ`
- `よきひたかなる`

のlexical / phrase-pattern plausibilityが上がった。

ただし
**author parallel ≠ target source glyph**
を新安全規則として固定。

## v1.10 fixed50 minimal-operation audit

追加:
- `data/fixed50-minimal-operation-audit-v110.json`
- commit `a29962b9a945c1bb9373c4ef1167415ba67281ea`

fixed50由来51 hybridを、
各歴史sourceからのA/B/C/D/E Hamming distanceで再分類。

結果:
- minimum distance 1: 38
- distance 2: 13
- >2: 0

distance-1:
- A-only = 26
- E-only = 12
- B-only = 0
- C-only = 0
- D-only = 0

distance-2:
- A+E = 11
- D+E = 2
- A+B = 2
- B+C = 1

semantic_cohesion=3のdistance-2は:
- hybrid-021
- hybrid-022
- hybrid-023

すべて秋・月のA+E。

したがって
安全な低リスクoperationの未実装が第三familyを阻んでいる、
という仮説は支持されない。

## v1.11 fixed50 + wave2 graph audit

追加:
- `data/wave2-factor-graph-expansion-audit-v111.json`
- commit `b27b81e3e12f88820a5fe01554a47400a8520d4d`

docs:
- `docs/MINIMAL_OPERATION_COVERAGE_V110_V111.md`
- commit `4ce3cd091516e2956284bd6c77b22f21a20464ff`

validator:
- `4e21ef86079ed843da1a5560c5b28934edf8b50b`
- Validate run `35470085034`
- **success**

fixed50 + wave2 verified14をresearch graphとして
AB / BC / CD / DE edgeで全列挙。

counts:
- combined novel paths = 90
- wave2 provenance含む = 48
- v0.35既存path再出現 = 9
- genuinely new = 39
- min-distance1 = 35
- min-distance2 = 13

min-distance1:
- A-only = 24
- E-only = 11
- B/C/D-only = 0

したがってwave2を加えても
single-factor low-risk operation空間はA/Eのみ。

title-level same-sceneで新規min1なのは、
旅行90/93の2方向A-onlyだけ。

現在のbottleneckを:

**operation invention → source coverage / source confirmation**

へ正式に移す。

## v1.12 Yamauchi visible poem-specific transcription

追加:
- `data/yamauchi-visible-transcription-review-v112.json`
- commit `d42b5b9f127bc239d0ca3a1e1fe6c334e3f4170c`

検索可能な山内1974記事再現から、
89〜96付近のpoem-specific scholarly transcriptionを直接確認可能になった。

重要なlayer分離:
- J-STAGE official metadata = verified
- 山内article transcription surface = readable
- article PDF direct inspection = false
- original Edo source image inspection = false

### 90

山内転写:
- ともかくも
- まはるなかたひ
- きよくゆく
- よき日たかなる
- はまもくかもと

target poem transcription自体が確認できた。

### 93

山内転写:
- やとちかく
- まはるなり 今
- みかきよき
- 神まいりなる
- はまくかちとや

`今` と `神` は山内転写で明示。

### 89

`八十や ...`

が山内転写で明示。
八十=`やそ` は辞書支持あり。

v0.43 source-image promotion policyはまだ変更せず、
`hold-by-existing-source-image-promotion-policy`。

### 94

山内転写:
- なかたひも
- ついおそきはる
- 友とちと
- もとるは 木曽を
- いつも 日たかな

`木曽を` が学術転写レイヤで見えるため、
v0.43の お/を mismatchはgeneric OCR問題ではなく
literal orthographic issueとして再分類。

current hold:
`hold-strict-orthographic-equivalence`

strict baselineは変更しない。

## v1.13 travel deep syntax review

追加:
- `data/wave2-travel-deep-syntax-review-v113.json`
- commit `e70048e60deb5f4f0c2fb31b074544a7874d31fe`

93番についてdictionary-supported hypothesis:

### やとちかく
`宿近く`
hypothesis。

宿=`やど`。
normalized devoicingとの関係はhypothesisのみ。

### みかき
`御垣`
hypothesis。

御垣は宮中・神社周囲の垣。
直後の山内転写 `神まいりなる` とscene上整合。

### はまくかちとや

辞書上:
- 浜
- 陸地（くがち／くがぢ）
- とや（と＋や）

が成立。

したがって:
`浜 + 陸地（くがち） + とや`

というboundary-shift parseは
dictionary-supported hypothesisとして有力。

ただしsource glyph reconstructionではない。

### best direction

`wave2-travel-090-host-093-outer`

meter:
- やとちかく
- まはるなかたひ
- きよくゆく
- よきひたかなる
- はまくかちとや

5句すべてが90/93の山内poem-specific転写で句単位attested。

same travel series。

旧:
`hold-source-confirmation`

新:
**`promising-but-parse-needed`**

combined syntax未解決なので
deep-review-supportedにはしない。

### reverse direction

`wave2-travel-093-host-090-outer`

90 ku5
`はまもくかもと`
がopaque。

新status:
`deep-review-needed`

## v1.14 current deterministic generator

追加:
- `data/generated-wave2-travel-outer-frame-v114.json`
- fixture commit `5dd8342d64f2e52786b80166a45bcc970750c0b9`

generator更新:
- `scripts/generate-wave2-travel-outer-frame-research.mjs`
- commit `1ca5072c3b24cacdb89d91dc28def9854eba148c`

v1.08はhistorical snapshotとして維持。

current candidate statuses:
- shoju-next-090 = historical-source
- shoju-next-093 = historical-source
- wave2-travel-090-host-093-outer = promising-but-parse-needed
- wave2-travel-093-host-090-outer = deep-review-needed

validator:
- commit `0147ca52bae9a94a9e6ac79225e3ca1d9057caa3`

Validate:
- run `35470400190`
- conclusion **success**

専用generatorも同runでsuccess。

docs:
- `docs/YAMAUCHI_VISIBLE_TRAVEL_REVIEW_V112_V114.md`
- commit `ed377e5d00e856b199a6620e8c17ec89a71e64ae`

## 現在のfamily状態

確立positive:
1. autumn-night-garden-moon
2. naha-spring-plants

strong unresolved:
3. musu-night-sky-family-moon
   - hybrid-007
   - promising-but-parse-needed

4. wave2-travel-maha
   - best = wave2-travel-090-host-093-outer
   - promising-but-parse-needed
   - reverse = deep-review-needed

第三positive family:
- **まだ確定しない**

## 固定事項

変更なし:
- fixed50
- wave2 verified14 / held5
- public bridge6
- v0.76 baseline
- general-factor-crossover disabled
- historical source textをpublic poolへ注入しない
- machine accepted/natural禁止

新たに強化:
- searchable scholarly transcriptionとoriginal source imageを分離
- author parallelとtarget glyphを分離
- dictionary-supported parse hypothesisをsource restorationと分離
- operation inventionを候補数増加目的で行わない

## 進捗目安

- 歴史回文研究・生成原理: **約94%**
- 怪文回文メーカー全体目標: **約92%**

## 次

優先:
1. 89「老賀」のsource-image promotion policyを再監査
2. 94をお/を historical-equivalence controlとして整理
3. 90 ku5 `はまもくかもと` のsource-safe parse探索
4. 93 `宿近く ↔ 陸地とや` hypothesisのpoem-specific裏づけ探索
5. それでも第三family確定に届かなければ、new verified historical source expansionへ移る

## 再開最短文

**「HANDOFF 39節から再開。v1.10/v1.11でA/E以外の低リスクoperation余地なしを確認。v1.12で山内の90/93該当歌転写を直接確認し、v1.13でtravel best directionをpromising-but-parse-neededへ昇格。v1.14 current generator/fixture、Validate run 35470400190 green。第三family未確定。次は89のpromotion policy、94の お/を equivalence、90 ku5 parse。」**
