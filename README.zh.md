# GitHub Copilot 词元优化工作坊

[English](./README.md) · **简体中文** · [繁體中文（香港）](./README.hk.md)

使用 **GitHub Copilot App** 和 **GPT-6.2 Sol** 制作同一期关于社区花园的**视频播客（Video Podcast / Vlog）**。从 `examples/garden.json` 的文本和网址出发，让同一期节目依次完成五个阶段：基线脚本、精简脚本简报、筛选证据、约束分镜、审核发布。对话稿就是 HyperFrames 视频的配音稿，而不是另一个项目。

## 实验路线

| 实验 | 时间 | 实验内容 | 原演示文稿页码 |
| --- | ---: | --- | --- |
| [01 · 测量基线](./01-baseline/README.zh.md) | 15 分钟 | 分词、隐藏上下文和输出成本 | 2–7、11 |
| [02 · 压缩提示词](./02-compress/README.zh.md) | 15 分钟 | 删去铺垫，不削弱任务约束 | 9–11 |
| [03 · 收窄上下文并测试复用](./03-context-cache/README.zh.md) | 20 分钟 | 缩小指令和工具的范围，区分范围缩减与缓存 | 12–15、21–28 |
| [04 · 约束输出并按风险路由](./04-output-routing/README.zh.md) | 20 分钟 | 对比输出限制、工作模式、模型和推理强度 | 16–20 |
| [05 · 按质量与成本把关发布](./05-budget-release/README.zh.md) | 20 分钟 | 测试预算准入条件，审核播客和视频产物 | 19、29–31 |

## 选择运行方式

- **浏览器回放：**打开 [GitHub Pages 上的英文工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=1)。它使用固定样本，不调用 Copilot，也不需要登录。指南已本地化；工作台、提示词和节目样例保留英文，方便所有人用同一组输入做对照。
- **本地回放：**使用 Node.js **22.12 或更高版本**及 npm，在仓库根目录运行：

  ```sh
  npm ci
  npm run build
  npm run serve
  ```

  打开服务打印的本地地址，或在另一个终端运行 `npm run bench -- --step 1`。随实验进度将编号从 `1` 改到 `5`。
- **Copilot App 和可选的 SDK 实时运行：**使用有权访问所需模型的账号登录。除明确测试复用外，每个对照组都新建对话。固定模型时选 **GPT-6.2 Sol**，不要选 Auto。仅进行文本交互，不批准编辑或工具调用。App 提示词和 SDK 命令是两种独立的实验方式，并不是同一个请求，上下文也未必相同。仅在获准后按所列命令每组运行一次；没有相应模型权限或预算时使用回放。

  用 `npm run bench -- --models` 检查 Copilot CLI 登录状态和 GPT-6.2 Sol 是否可用，不会提交生成请求。此命令不检查 App 的模型列表，也不保证路由模型可用。

## 对比改写前后的提示词元数

在工作台的 **Compare your own prompts（对比自定义提示词）**中，将原简报粘贴到 **Before**，改写版粘贴到 **After**，选择 **Compare tokens**。每次只改一个变量，保持事实和质量标准不变。浏览器上的 `o200k_base` 计数只是**可见提示词的词元估算**，不是完整请求用量。例如，实验 02 的内置简报从 **400 降到 362 个可见词元**；独立回放的**模拟输入词元从 1,260 降到 1,210**，输出保持不变。显示的回放成本由模拟用量计算，不是由本地分词值计算。

实时 [Copilot SDK](https://github.com/microsoft/copilot-sdk)（`@github/copilot-sdk`）用量是 SDK 会话的原始遥测数据，既不能还原 App 用量，也不是账单。完整请求还可能包含可见提示词之外的指令、历史、文件上下文和工具定义。

工作坊采用 **GPT-6.2 Sol**、**上下文不超过 272K** 时的默认费率：每百万词元 **输入 2.00 美元 / 缓存读取 0.10 美元 / 缓存写入 2.50 美元 / 输出 10.00 美元**。各用量类别分别乘以对应费率、除以一百万，再求和。请以 [GitHub 的 Copilot 模型和定价](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)及账号的账单报告为准。缺失的遥测值代表未知，不是零。

## 渲染视频播客（Video Podcast / Vlog）

在仓库根目录运行样例：

```sh
npm run vlog -- --input examples/garden.json
# 可选：使用已认证的 Copilot SDK 实时运行
npm run vlog -- --input examples/garden.json --live
# 可选：将离线样例渲染为 MP4
npm run vlog -- --input examples/garden.json --render
```

默认使用内置示例稿；`--live` 使用已认证的 SDK；也可按实验 05 用 `--script episode.txt` 采用通过审核的 App 脚本。对应模式分别将 `episode.json` 写入 `reports/vlog/fixture/`、`reports/vlog/live/` 或 `reports/vlog/script/`。可选的 `--render` 会在同一目录下添加 `episode.mp4` 和 `project/index.html`，需要使用版本固定的 [HyperFrames](https://github.com/heygen-com/hyperframes)、`ffmpeg`、`ffprobe` 及 macOS `say` 的 Samantha 和 Daniel 语音。

可以提供自己的 JSON：`{ "title": "...", "content": "...", "links": ["https://example.com/"] }`，或在工作台用 **Make a source packet** 直接下载 JSON，无需向服务器发送内容。链接仅供参考，**不会自动抓取**；请把有权复用的相关摘录粘贴到 `content`。分享产物前，对照来源核实稿件、检查时间线或预览 MP4，并移除敏感信息。

## 验证与致谢

用 `npm test` 运行自动化检查，用 `npm run screenshots` 重新生成实验截图。如果 Playwright 提示缺少 Chromium，请先运行 `npx playwright install chromium`。

改编自 **Xuefeng Yin（Microsoft，AI Apps GBB）** 的 *GitHub Copilot Token Optimization: An engineering playbook for the Usage-Based Billing era*。公开工作坊不包含原始演示文稿。

[开始实验 01 →](./01-baseline/README.zh.md)
