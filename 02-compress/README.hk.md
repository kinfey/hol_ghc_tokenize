# 實驗 02 · 壓縮劇本簡報

[English](./README.md) · [简体中文](./README.zh.md) · **繁體中文（香港）**

15 分鐘 · 原簡報第 9–11 頁 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=2)（[本機工作台](../workbench.html?step=2)） · [流程圖](./flow.svg) · [截圖](./evidence.png)

**視像播客交接成品：**為同一集節目保留一份更精簡嘅劇本簡報。將過關嘅簡報同事實清單帶去實驗 03，繼續篩選證據。

## 原理同 Copilot App 對照實驗

縮短措辭，唔好縮減要求。刪走客套話同重複指示，但保留清楚嘅事實、輸出格式同驗收準則。有結構嘅簡報容易核對；唔好假設轉用另一種語言就一定慳詞元。

A 組用[實驗 01 嘅原有提示詞](../01-baseline/README.hk.md)。B 組喺新嘅 **GPT-6.2 Sol** 對話用下面提示詞，保持設定一致。只改簡報措辭同次序；舊筆記、事實、講者格式同目標長度維持不變。比較提示詞嘅詞元估算，再用同一製作準則逐項對照兩份稿。

```text
Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.
Aim for 180–220 spoken English words. Include an opening, background, several exchanges, and a closing.

Archive note: Previous season notes about microphones, theme music, studio furniture, lighting, and scheduling contain no episode facts.
```

## 重播同檢查點

```sh
npm run bench -- --step 2
# 可選：SDK 每組一次，共兩次請求
npm run bench -- --step 2 --live
```

**改寫前 → 改寫後：**內置簡報由 **400 減到 362 個可見提示詞元**（少 38 個，跌幅 9.5%）。喺 **Compare your own prompts** 貼入 App 版本，分別量度改寫前後；佢哋嘅舊筆記同內置版本唔同。另一組係重播嘅**模擬輸入詞元由 1,260 減到 1,210**，輸出固定 280，快取係零。顯示成本用重播用量計，唔係用可見提示詞計數。自動評分只睇基本對話格式同事實原句；節奏同 180–220 詞嘅目標要自己核對。

**SDK 實測 A/B：**兩個獨立工作階段入面，可見提示詞由 **400 減到 362** 個 Token（−9.5%），SDK 輸入由 **3,565 減到 3,527**，輸出由 **266 減到 256**。兩組都通過格式同事實檢查。睇 [Playwright 截圖](./comparison.png)，或者喺工作台嘅 **Compare your own prompts** 貼入兩段文字試吓；瀏覽器唔會將文字送畀模型。一次對比唔代表之後一定會慳幾多。

**檢查點：**B 組要保留原有要求，份稿亦仲適合口播，先採用精簡版本。記低刪咗咩、保留咗咩。**常見陷阱：**呢組唔好轉模型、刪證據，或者加入硬性輸出上限。

[← 實驗 01](../01-baseline/README.hk.md) · [實驗 03 →](../03-context-cache/README.hk.md)
