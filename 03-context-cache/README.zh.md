# 实验 03 · 筛选并复用节目证据

[English](./README.md) · **简体中文** · [繁體中文（香港）](./README.hk.md)

20 分钟 · 原演示文稿第 12–15、21–28 页 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=3)（[本地工作台](../workbench.html?step=3)） · [流程图](./flow.svg) · [截图](./evidence.png)

**视频播客交付物：**保留最小证据包，包括三条已核实原句、出处笔记和参考网址，为实验 04 的口播和画面提供依据。

## 原理

收窄范围是删除无关材料。缓存可能复用未变更前缀的处理结果，但不会让无关材料变得有用。设计可复用的简报时，将固定证据放在前面，变化的指令放在末尾，分别记录缓存读取和写入。相同前缀或重复发送消息都不保证命中。

在真实项目中，仅把不可妥协的要求放入常驻指令。对特定任务使用路径限定规则（若支持，可用 `applyTo`）、按需技能或自定义代理。引用最小的相关片段，移除不用的 MCP 工具，并为无关任务开启新对话。如需子代理阅读多个来源，请让它返回核实过的摘要，而不是堆砌原文；委派同样有成本。

## Copilot App 对照实验

1. **仅收窄范围：**在两个新的 **GPT-6.2 Sol** 对话中，对比[实验 02 的 B 组原始提示词](../02-compress/README.zh.md)与下方简报。只删去无关归档笔记。参考网址留在制作笔记里，不附加归档资料，也不要求 Copilot 抓取链接。
2. **仅测试复用：**将第一次提交收窄版作为冷请求候选，再在同一对话中原样发送一次，作为热请求候选。文字、设置和模型保持不变。有遥测时才对比缓存读取和写入。第二次请求也会加入对话历史，因此输入总量变化不能证明复用。没有缓存信号时记为“未观察到”。

```text
Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.
Aim for 180–220 spoken English words. Include an opening, background, several exchanges, and a closing.
```

## 回放与检查点

```sh
npm run bench -- --step 3
# 可选：三次 SDK 请求（宽范围、首次窄范围、重复窄范围）
npm run bench -- --step 3 --live
```

删去归档笔记后，内置简报从 **362 降到 72 个可见提示词元**。独立的固定回放合并了两个变量：“宽范围／冷”有 1,210 个模拟输入词元、无缓存读取；“窄范围／热”有 310 个输入词元、420 个缓存读取词元。回放成本演示两种手段的组合，不能分别归因；请使用上面的独立对照。

**检查点：**每项事实仍有出处，配音稿没有用到已移除资料，笔记明确区分可见词元减少与真实缓存遥测。**易错点：**改动或重排前缀会改变可复用的内容；缓存读取并非免费，也不要假定没有发生缓存写入。

[← 实验 02](../02-compress/README.zh.md) · [实验 04 →](../04-output-routing/README.zh.md)
