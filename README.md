# 怪文回文メーカー

AI APIを使わず、回文制約と日本語の構文パターンを組み合わせて「意味は通るのに少し怪しい」回文を生成する試作プロジェクトです。

## 現在の版

公開試験版 v0.4。

v0.3で機械生成した1000原種を日本語自然さの観点から規則単位で一次監査しました。

- 一次採用: **36件**
- 文体方針の裁定待ち: **89件**
- 低怪文度の土台から除外: **875件**
- 公開データ125件は、かな表記で完全回文であることを再検証済み

89件の裁定待ちは個別確認ではなく、次の2方針に集約しています。

1. 助詞省略の電文・会話調を許すか（61件）
2. 助詞省略＋非過去形の舞台指示調を許すか（28件）

現時点の推奨は、どちらも標準原種からは外し、将来の実験モード用に温存することです。

## ファイル

- `index.html` 公開試験UI
- `data/usable-seeds.json` 一次監査後の採用・裁定待ち125件
- `data/review-queue.json` 2件に圧縮した裁定事項
- `docs/CORPUS_AUDIT.md` 一次監査の根拠
- `.github/workflows/pages.yml` GitHub Pages 配信用

## GitHub Pages

Pages 用 workflow は設定済みです。初回実行では、GitHub App から Pages サイトを新規有効化する権限がなく、`actions/configure-pages` の enablement で停止しました。

リポジトリ所有者が GitHub の **Settings → Pages → Build and deployment → Source: GitHub Actions** を一度有効化すれば、その後この workflow を再実行して公開できます。

想定公開URL: `https://yama-books.github.io/kaibun/`
