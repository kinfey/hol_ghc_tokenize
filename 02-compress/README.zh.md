# 实验 02 · 压缩脚本简报

[English](./README.md) · **简体中文** · [繁體中文（香港）](./README.hk.md)

15 分钟 · 原演示文稿第 9–11 页 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=2)（[本地工作台](../workbench.html?step=2)） · [流程图](./flow.svg) · [截图](./evidence.png)

**视频播客交付物：**为同一期节目保留更简洁的脚本简报。将通过检查的简报和事实清单带入实验 03，继续筛选证据。

## 原理与 Copilot App 对照实验

压缩措辞，不压缩要求。删去客套话及重复指令，明确保留事实、输出格式和验收标准。结构化简报更容易审核；不要假设换一种语言就一定省词元。

A 组使用[实验 01 的原始提示词](../01-baseline/README.zh.md)。B 组使用下方提示词，在新的 **GPT-6.2 Sol** 对话中保持设置一致。只改变简报的措辞和顺序；归档笔记、事实、说话人格式和目标长度不变。比较提示文本的词元估算，并按相同制作标准逐项检查两份稿件。

```text
Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.
Aim for 180–220 spoken English words. Include an opening, background, several exchanges, and a closing.

Archive note: Previous season notes about microphones, theme music, studio furniture, lighting, and scheduling contain no episode facts.
```

## 回放与检查点

```sh
npm run bench -- --step 2
# 可选：SDK 每组一次，共两次请求
npm run bench -- --step 2 --live
```

**改写前 → 改写后：**内置简报从 **400 降到 362 个可见提示词元**（少 38 个，降幅 9.5%）。在 **Compare your own prompts** 粘贴 App 版本，分别测量改写前后；它们的归档笔记与内置版本不同。另一组数据是回放的**模拟输入词元从 1,260 降到 1,210**，输出固定为 280，缓存为零。显示的成本基于回放用量，不是可见提示词计数。自动评分只检查基本对话格式和事实原句；节奏和 180–220 词的目标需人工检查。

**SDK 实测 A/B：**两个独立会话中，可见提示词从 **400 降至 362** 个 Token（−9.5%），SDK 输入从 **3,565 降至 3,527**，输出从 **266 降至 256**。两组都通过格式和事实检查。查看 [Playwright 截图](./comparison.png)，或在工作台的 **Compare your own prompts** 中粘贴两段文本自行对比；浏览器不会把文本发送给模型。一次对比不能预测后续节省幅度。

**检查点：**只有 B 组保留了原有要求、稿件依然适合口播，才采用精简版本。记录删了什么、保留了什么。**易错点：**这一组不要更换模型、删减证据或引入硬性输出上限。

[← 实验 01](../01-baseline/README.zh.md) · [实验 03 →](../03-context-cache/README.zh.md)
