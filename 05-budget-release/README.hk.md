# 實驗 05 · 為算繪同發佈把關

[English](./README.md) · [简体中文](./README.zh.md) · **繁體中文（香港）**

20 分鐘 · 原簡報第 19、29–31 頁 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=5)（[本機工作台](../workbench.html?step=5)） · [流程圖](./flow.svg) · [截圖](./evidence.png)

**視像播客交接成品：**作出發佈決定，同時審核分鏡時間線；如果算繪咗節目，亦要審核 MP4。沿用實驗 01–04 嘅來源包、事實同四場劇本要求。

## 原理同 Copilot App 對照實驗

候選版本要通過質素檢查，而且已用金額加估計請求成本唔超過上限，先可以繼續。喺生成或算繪之前測試呢個決定。教學關卡唔係帳戶限額：實際管理要用 GitHub 組織預算同成本中心，另外記錄算繪同重試成本。

開新嘅 **GPT-6.2 Sol** 對話，原樣提交下面提示詞嚟審核參考劇本。要測試質素關卡，只將候選對話入面嘅 `200 liters` 改做 `300 liters`（唔好改已核實原句），用相同設定開新對話再試。預期參考稿係 `PASS`，改動版係 `FAIL`，自己再核對兩個決定。之後用同一準則審核實驗 04 嘅候選劇本同生成嘅時間線。

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

## 重播預算關卡

```sh
npm run bench -- --step 5
npm run bench -- --step 5 --budget 0.001
# 可選：為獲批嘅候選版本發送一次 SDK 請求，唔會算繪
npm run bench -- --step 5 --live
```

預設上限係 **0.005 美元**，已用 **0.001 美元**時，重播會擋住基準版本，放行常規候選版本。將上限降到 **0.001 美元**，兩個版本都會被擋：同一份劇本可以過質素關，但過唔到預算關。實驗 05 嘅即時基準測試會喺提交前檢查教學估價，但影片 CLI 係另一個指令，唔受呢道關卡限制。將結果當成人手檢查點，唔好當作收費承諾。

## 算繪同驗證

用[來源 JSON 樣本](../examples/garden.json)，或者喺工作台揀 **Make a source packet**，直接喺瀏覽器下載 JSON。瀏覽器唔會提交內容；網址只供參考，唔會自動擷取。將獲准重用嘅相關摘錄填入 `content`。

```sh
npm run vlog -- --input examples/garden.json
# 可選：獲批後，用已驗證身份嘅 SDK 生成一次
npm run vlog -- --input examples/garden.json --live
# 可選：將離線樣本算繪成有旁白嘅 MP4
npm run vlog -- --input examples/garden.json --render
```

要**原樣用實驗 04 已審核嘅 App 劇本**製作影片，淨係將四行 `Host:`/`Guest:` 對話存成儲存庫根目錄下嘅 UTF-8 `episode.txt`。喺下面指令加 `--render` 就會算繪有旁白嘅影片；唔好同時用 `--script` 同 `--live`。

```sh
npm run vlog -- --input examples/garden.json --script episode.txt
```

預設用內置示範稿；`--live` 根據來源包生成新對話。三種模式分別喺 `reports/vlog/fixture/`、`reports/vlog/live/` 或 `reports/vlog/script/` 寫入 `episode.json`（講稿同時間線）。`--render` 會喺同一模式目錄加上 `episode.mp4` 同 `project/index.html`。有旁白嘅算繪要用 macOS 嘅 `say` 語音 **Samantha** 同 **Daniel**，以及 `ffmpeg` 同 `ffprobe`；指令稿會呼叫固定版本嘅 HyperFrames 套件。獲批做即時算繪時，一次過用 `--live --render`，避免即時生成兩次。

**檢查點：**逐項對照來源核實事實，每場對應一輪口播，分享之前檢查字幕、旁白、轉場同播放效果。記低批准結果或卡住嘅原因。**常見陷阱：**只有 `--script` 先會讀 App 對話。檢查實際嘅 `episode.json` 同 MP4，唔好分享私有來源或者上一次運行留低嘅成品。

[← 實驗 04](../04-output-routing/README.hk.md) · [工作坊首頁 →](../README.hk.md)
