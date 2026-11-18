# GitHub Copilot 詞元優化工作坊

[English](./README.md) · [简体中文](./README.zh.md) · **繁體中文（香港）**

用 **GitHub Copilot App** 同 **GPT-6.2 Sol** 製作同一集關於社區花園嘅**視像播客（Video Podcast / Vlog）**。由 `examples/garden.json` 嘅文字同網址出發，同一集節目會經過五個階段：基準劇本、精簡劇本簡報、篩選證據、限制分鏡、審核發佈。對話稿就係 HyperFrames 影片嘅配音稿，唔係另一個項目。

## 實驗路線

| 實驗 | 時間 | 測試重點 | 原簡報頁碼 |
| --- | ---: | --- | --- |
| [01 · 量度基準](./01-baseline/README.hk.md) | 15 分鐘 | 分詞、隱藏上下文同輸出成本 | 2–7、11 |
| [02 · 壓縮提示詞](./02-compress/README.hk.md) | 15 分鐘 | 刪走鋪墊，保留任務要求 | 9–11 |
| [03 · 收窄上下文並測試重用](./03-context-cache/README.hk.md) | 20 分鐘 | 收窄指示同工具範圍，分開量度範圍縮減同快取 | 12–15、21–28 |
| [04 · 限制輸出並按風險路由](./04-output-routing/README.hk.md) | 20 分鐘 | 比較輸出上限、工作模式、模型同推理力度 | 16–20 |
| [05 · 以質素及成本把關發佈](./05-budget-release/README.hk.md) | 20 分鐘 | 測試預算准入條件，審核 Podcast 同 Vlog 成品 | 19、29–31 |

## 選擇運行方式

- **瀏覽器重播：**開啟 [GitHub Pages 上嘅英文工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=1)。工作台用固定樣本，唔會呼叫 Copilot，亦唔使登入。指南已本地化，工作台、提示詞同節目樣本保留英文，方便大家用同一組輸入比較。
- **本機重播：**用 Node.js **22.12 或更新版本**同 npm，喺儲存庫根目錄執行：

  ```sh
  npm ci
  npm run build
  npm run serve
  ```

  開啟伺服器顯示嘅本機網址，或者喺另一個終端執行 `npm run bench -- --step 1`。跟住進度，將步驟號碼由 `1` 改到 `5`。
- **Copilot App 同可選嘅 SDK 即時測試：**用有權使用所需模型嘅帳戶登入。除非要測試重用，每個對照組都開新對話。要固定模型時，揀 **GPT-6.2 Sol**，唔好揀 Auto。只做純文字互動，唔批准編輯或工具呼叫。App 提示詞同 SDK 指令係兩種獨立嘅實驗方式，唔係同一個請求，上下文亦未必一樣。獲批先按所列指令每組執行一次；冇模型權限或未有預算批准，就用重播。

  用 `npm run bench -- --models` 查 Copilot CLI 登入狀態同 GPT-6.2 Sol 係咪可用，唔會提交生成請求。呢個指令唔會查 App 嘅模型清單，亦唔保證路由模型可用。

## 比較改寫前後嘅提示詞元數

喺工作台嘅 **Compare your own prompts（比較自訂提示詞）**將原有簡報貼入 **Before**，改寫版貼入 **After**，再揀 **Compare tokens**。每次只改一項，事實同質素標準維持不變。瀏覽器用 `o200k_base` 計嘅只係**可見提示詞嘅詞元估算**，唔係完整請求用量。例如實驗 02 嘅內置簡報由 **400 減到 362 個可見詞元**；另一邊重播嘅**模擬輸入詞元就由 1,260 減到 1,210**，輸出維持不變。重播顯示嘅成本用模擬用量計，唔係用本機分詞值計。

即時 [Copilot SDK](https://github.com/microsoft/copilot-sdk)（`@github/copilot-sdk`）傳回 SDK 工作階段嘅原始遙測，唔可以用嚟還原 App 用量，亦唔係帳單。完整請求仲可能包括可見提示詞以外嘅指示、對話歷史、檔案上下文同工具定義。

工作坊採用 **GPT-6.2 Sol**、**上下文最多 272K** 嘅預設費率：每百萬詞元 **輸入 2.00 美元／快取讀取 0.10 美元／快取寫入 2.50 美元／輸出 10.00 美元**。將每類詞元數乘以對應費率、除以一百萬，再加總。最新條款同實際用量以 [GitHub Copilot 模型及定價](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)同帳戶帳單報告為準。遙測冇提供數值，即係未知，唔係零。

## 算繪視像播客（Video Podcast / Vlog）

喺儲存庫根目錄執行樣本：

```sh
npm run vlog -- --input examples/garden.json
# 可選：使用已驗證身份嘅 Copilot SDK 即時執行
npm run vlog -- --input examples/garden.json --live
# 可選：將離線樣本算繪成 MP4
npm run vlog -- --input examples/garden.json --render
```

預設用內置示範稿；`--live` 用已驗證身份嘅 SDK；亦可以跟實驗 05 用 `--script episode.txt` 採用已審核嘅 App 劇本。各模式分別將 `episode.json` 寫入 `reports/vlog/fixture/`、`reports/vlog/live/` 或 `reports/vlog/script/`。可選嘅 `--render` 會喺同一目錄加入 `episode.mp4` 同 `project/index.html`，要用固定版本嘅 [HyperFrames](https://github.com/heygen-com/hyperframes)、`ffmpeg`、`ffprobe` 同 macOS `say` 嘅 Samantha 同 Daniel 語音。

可以提供自己嘅 JSON：`{ "title": "...", "content": "...", "links": ["https://example.com/"] }`，或者喺工作台用 **Make a source packet** 直接下載 JSON，唔使將內容傳送到伺服器。連結只供參考，**唔會自動擷取內容**；將你獲准重用嘅相關摘錄貼入 `content`。分享成品之前，對照來源核實講稿、核對時間線或預覽 MP4，並移除敏感資料。

## 驗證同鳴謝

用 `npm test` 執行自動檢查，用 `npm run screenshots` 重新產生實驗截圖。如果 Playwright 提示冇裝 Chromium，先執行 `npx playwright install chromium`。

改編自 **Xuefeng Yin（Microsoft，AI Apps GBB）** 嘅 *GitHub Copilot Token Optimization: An engineering playbook for the Usage-Based Billing era*。公開工作坊唔包括原簡報。

[開始實驗 01 →](./01-baseline/README.hk.md)
