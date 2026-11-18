# 实验 04 · 限制分镜并按风险路由

[English](./README.md) · **简体中文** · [繁體中文（香港）](./README.hk.md)

20 分钟 · 原演示文稿第 16–20 页 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=4)（[本地工作台](../workbench.html?step=4)） · [流程图](./flow.svg) · [截图](./evidence.png)

**视频播客交付物：**把四场脚本和路由决定带入实验 05。每轮口播对应一场，为每轮构思一个有来源依据的画面或字幕。

## 原理与 Copilot App 对照实验

输出约束可同时限制口播和要制作的场数。提示词里的词数限制并不是 API 强制词元上限，仍需检查结果。起草时用一次文本回答；设计需要时再用规划模式；仅在确有价值时让代理多步执行。测试模型差异时，在支持的情况下固定推理强度；测试推理强度时只改变该设置。

1. **输出上限：**在设置一致的新 **GPT-6.2 Sol** 对话中，对比[实验 03 的窄范围提示词](../03-context-cache/README.zh.md)和下面的受限提示词。记录格式、事实、口播词数和可获得的输出词元数据。
2. **常规路由：**在新的 **GPT-6 Luna** 对话中用同一受限提示词，对比受限的 Sol。轻量版必须通过同一套检查才能采用。
3. **证据冲突：**测试冲突场景时，在受限提示词末尾追加下面单独列出的句子，路由到 **GPT-6.2 Sol**。只在同一个风险场景中比较模型；更强的模型不能代替核对来源。

```text
Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.
Exactly four lines and at most 85 spoken words.
```

```text
The producer notes conflict about the tank size. Treat the three verified sentences above as authoritative; do not mention unverified details.
```

## 回放与检查点

```sh
npm run bench -- --step 4
npm run bench -- --step 4 --case conflicting
# 可选：为选定场景运行一次 SDK 实验，共三次请求
npm run bench -- --step 4 --live
# 若改测冲突场景，在末尾追加 --case conflicting。
```

回放中的候选输出从 280 降到 90 个词元。切换为来源冲突后，候选路由从 GPT-6 Luna 变为 GPT-6.2 Sol。回放行同时改变两个变量；比较长、短两种 Sol 脚本可单独测上限，在常规场景对比受限版 Sol 和 Luna 可单独测模型。

**检查点：**四轮口播、不超过 85 个口播词、保留三条事实原句，并为每轮准备画面或字幕构思。这些构思是审核笔记，不是 CLI 读取的字段。**易错点：**即使便宜，只要加入未经证实的说法、场数不对或需大量返工，就不能通过。

[← 实验 03](../03-context-cache/README.zh.md) · [实验 05 →](../05-budget-release/README.zh.md)
