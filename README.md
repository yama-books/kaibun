# 怪文回文メーカー

AI APIを使わず、回文制約と日本語の構文パターンを組み合わせて「意味は通るのに少し怪しい」回文を生成する試作プロジェクトです。

## 現在の版

公開試験版 v0.4。

v0.3で機械生成した1000原種を一次監査し、公開画面では自然さを優先した36原種を既定で使用します。文体判断が必要な89候補は別枠に分離しました。

- `index.html` 公開試験UI
- `data/review-queue.json` ユーザー裁定を2件の方針判断に圧縮
- `docs/CORPUS_AUDIT.md` 一次監査の根拠
- `.github/workflows/pages.yml` GitHub Pages 配信用

GitHub Pagesでの試験公開を想定しています。