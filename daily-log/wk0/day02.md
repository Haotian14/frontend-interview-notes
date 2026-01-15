# Day 02 Log（wk0 day2）

## 今天完成了什么

- 完成 Git 分支训练：创建功能分支、连续提交、在 main 与 feature 上修改同一文件并制造冲突
- 成功完成一次 **merge 合并 + 冲突解决**，生成 merge commit，并用 `git log --graph` 验证分支图
- 验证本地与远端同步：确认 `main` 与 `origin/main` 指向同一提交

## 今天练到的 Git 流程（复盘版）

- 从 `main` 拉分支：`feat/git-drill`
- 在 feature 分支做 3 次提交（初始化文件、补 checklist、改标题）
- 切回 `main` 对同一文件做修改，制造分叉
- `main` 上执行 `git merge feat/git-drill` 触发冲突 → 手动解决冲突 → 提交 merge commit
- 使用命令确认分支关系与合并结果：
  - `git log --oneline --graph --decorate --all --max-count=20`
  - `git status`

## 卡住的点 / 注意点

- rebase 练习分支命名有拼写问题（`feat/rebase-dril` 少了一个 `l`），且当前它与 `main` 重合，所以暂时看不出 rebase 的“分叉 → 变直线”效果
- 冲突解决时需要明确最终保留版本（把两边内容合并成一个一致版本，并删掉冲突标记）

## 明天自测重点关注（Day2 剩余内容）

- JS 基础摸底（this / 原型链 / Promise / event loop / 常见手写题思路）
- TS 基础摸底（联合/交叉、泛型、工具类型）
- React 核心快检（渲染机制、Hooks、依赖数组、性能点）
- （可选补做）重新做一遍 **可视化 rebase 最短流程**：确保能看到 rebase 改写历史 & commit hash 变化

## 备注

- 今日目标：只完成 Git ✅
- Day2 其他部分延后到明天完成
