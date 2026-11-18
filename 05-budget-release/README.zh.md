# 实验 05 · 为渲染与发布把关

[English](./README.md) · **简体中文** · [繁體中文（香港）](./README.hk.md)

20 分钟 · 原演示文稿第 19、29–31 页 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=5)（[本地工作台](../workbench.html?step=5)） · [流程图](./flow.svg) · [截图](./evidence.png)

**视频播客交付物：**给出发布决定并审核分镜时间线；若渲染了节目，还要审核 MP4。沿用实验 01–04 的来源包、事实和四场脚本要求。

## 原理与 Copilot App 对照实验

候选版本只有通过质量检查，且已花费用加上预计请求成本不超过上限，才可进入下一步。在生成或渲染前测试这个决定。教学门槛不是真实账号限额：实际管理应使用 GitHub 组织预算和成本中心，另行追踪渲染和重试成本。

新建 **GPT-6.2 Sol** 对话，原样提交下面的提示词来审核参考脚本。为测试质量门槛，只将候选对话里的 `200 liters` 改为 `300 liters`（不要改已核实原句），然后在设置一致的新对话再试一次。预期参考稿为 `PASS`，改动版为 `FAIL`，人工核实两个判断。再用同样的标准审查实验 04 的候选脚本和生成的时间线。

```text
Review this four-scene English video podcast screenplay. It must have exactly four alternating Host: and Guest: lines, at most 85 spoken words excluding labels, and these exact verified sentences:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Reject any material factual claim not supported by these facts. Return exactly one line starting with PASS or FAIL, followed by a brief reason. Do not rewrite the screenplay.

Host: Welcome to The Community Garden. Rainwater feeds the garden.
Guest: The tank holds 200 liters. It helps the team make better use of the rain.
Host: Who keeps the system ready for the next shower?
Guest: Volunteers check the filter every Friday. Thanks for listening!
```

## 回放预算门槛

```sh
npm run bench -- --step 5
npm run bench -- --step 5 --budget 0.001
# 可选：对获准的候选版本发送一次 SDK 请求，不渲染
npm run bench -- --step 5 --live
```

默认上限为 **0.005 美元**，已花 **0.001 美元**时，回放阻止基线版本，允许常规候选版本。将上限降低到 **0.001 美元**后，两个版本都受阻：同一份脚本可以通过质量检查，却无法通过预算检查。实验 05 的实时基准命令在提交前检查教学估算；视频 CLI 是独立命令，不受这道门槛拦截。请把结果当作人工检查点，不要当作费用承诺。

## 渲染与验证

使用[示例源 JSON](../examples/garden.json)，或在工作台选择 **Make a source packet**，直接在浏览器中下载 JSON。浏览器不提交其内容；网址仅供参考，不会自动抓取。将获准复用的相关摘录填入 `content`。

```sh
npm run vlog -- --input examples/garden.json
# 可选：获准后，通过已认证的 SDK 生成一次
npm run vlog -- --input examples/garden.json --live
# 可选：将离线样例渲染为带旁白的 MP4
npm run vlog -- --input examples/garden.json --render
```

若要将**实验 04 通过审核的 App 脚本原样**用于制作，把四行 `Host:`/`Guest:` 对话单独保存为仓库根目录下的 UTF-8 `episode.txt`。为下方命令加上 `--render` 即可渲染带旁白的视频；请勿同时使用 `--script` 和 `--live`。

```sh
npm run vlog -- --input examples/garden.json --script episode.txt
```

默认使用内置示例稿；`--live` 按来源包生成新对话。三种模式分别在 `reports/vlog/fixture/`、`reports/vlog/live/` 或 `reports/vlog/script/` 下写入 `episode.json`（稿件和时间线）。`--render` 在同一模式目录中另写 `episode.mp4` 和 `project/index.html`。渲染旁白需使用 macOS 的 `say` 语音 **Samantha** 和 **Daniel**，以及 `ffmpeg` 和 `ffprobe`；脚本调用版本固定的 HyperFrames 包。如果获准实时渲染，合用 `--live --render`，避免实时生成两次。

**检查点：**逐项对照来源核实事实，一场对应一轮口播，并在分享前检查字幕、旁白、转场和播放效果。记录批准结论或阻塞原因。**易错点：**只有 `--script` 才会读取 App 对话。检查实际的 `episode.json` 和 MP4，不要分享私有来源或上一次运行遗留的产物。

[← 实验 04](../04-output-routing/README.zh.md) · [工作坊首页 →](../README.zh.md)
