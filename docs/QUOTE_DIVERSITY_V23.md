# v0.23 固定引用長文の語彙分散

衝突回避だけでは、各familyの最初の外枠が同じになりやすい。

v0.23では source family id から安定ハッシュを作り、
自然さ優先のtopic wrapper群の開始位置をfamilyごとに回転させる。

## 結果

固定引用family: 12
最初のwrapper種類: 6

- quote-matsutake: decide-topic
- quote-garden: hear-kuki
- quote-reason: hear-topic
- quote-wait: say-topic
- quote-time: hear-kuki
- quote-young: interpret-topic
- quote-light: ask-topic
- quote-sleep: decide-topic
- quote-arrival: say-topic
- quote-existence: ask-topic
- quote-situation: hear-kuki
- quote-location: hear-kuki

同じfamilyは再生成しても同じ順序になる一方、family間では外側人物が散る。
名詞衝突は引き続き0件。
