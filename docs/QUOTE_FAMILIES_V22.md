# v0.22 引用長文の母体拡張

固定監査済みの引用長文化を4系統から **12系統**へ増やした。

追加母体:
- 時間
- 若さ（属性）
- 軽さ（属性）
- 睡眠
- 来訪
- 存在
- 状況
- 場所の目撃

## 衝突回避

各familyは元文を見てwrapperを選ぶ。

例:
- 元文に「タミ」がある → タミwrapperを最初から使わない
- 元文に「旦那」がある → 旦那を含む記録・同定wrapperを使わない
- 一度使った外側名詞は、以後その文の内側に含まれるので自動的に再使用されない

## 集計

- narrative family total: 30
- fixed quote families: 12
- narrative stages: 212
- fixed quote noun collisions: 0
- longest fixed reading: 149かな
