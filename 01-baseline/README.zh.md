# 实验 01 · 测量基线

[English](./README.md) · **简体中文** · [繁體中文（香港）](./README.hk.md)

15 分钟 · 原演示文稿第 2–7、11 页 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=1)（[本地工作台](../workbench.html?step=1)） · [流程图](./flow.svg) · [截图](./evidence.png)

**视频播客交付物：**根据[源 JSON](../examples/garden.json)制作基线配音稿和三条事实核对清单，两者一并带入实验 02。

## 原理

词元是模型切分文本得到的片段，不等同于单词或字符。隐藏指令、历史、文件上下文和工具定义会让短提示词变成长请求。分别测量可见文本、实时用量和输出质量。不同语言的分词可能不同，不能凭一个句子得出通用排名。

## Copilot App 对照实验

1. 打开 `examples/garden.json`，找出节目标题、给定文本和参考网址。使用下面三条已核实的事实，并标记原文中各自的依据，无需自动访问网址。
2. 新建纯文本对话，选择 **GPT-6.2 Sol**，原样提交下面的提示词。保存配音稿，记录口播词数（不含说话人标签）、事实覆盖情况及任何新增说法。实验 02 保持模型和源事实不变。

```text
You are a friendly, helpful podcast producer. We'd love it if you took a little time to make a polished and substantial script for our listeners, with an opening, background, several conversational exchanges and a closing. Please aim for 180–220 spoken English words.

Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.

Archive note: Previous season notes about microphones, theme music, studio furniture, lighting, and scheduling contain no episode facts.
```

## 回放与检查点

```sh
npm run bench -- --step 1
# 可选：发送一次 SDK 基线请求
npm run bench -- --step 1 --live
```

找到输入、缓存读取、缓存写入和输出四类用量。固定样例有 1,260 个输入词元和 280 个输出词元，没有缓存用量，估算为 **0.00532 美元**。另用同一分词器对比工作台里短句的英文、简体中文和繁体中文版本。SDK 样例的归档笔记比此处 App 示例更长，不应将两者的词元数当成同一请求来比较。

**检查点：**保留一份有来源依据的配音稿、三条已核实事实和基线测量结果。**易错点：**有链接不代表访问过；估算值不是账单。

[← 工作坊首页](../README.zh.md) · [实验 02 →](../02-compress/README.zh.md)
