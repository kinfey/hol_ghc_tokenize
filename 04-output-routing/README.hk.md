# 實驗 04 · 限制分鏡並按風險路由

[English](./README.md) · [简体中文](./README.zh.md) · **繁體中文（香港）**

20 分鐘 · 原簡報第 16–20 頁 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=4)（[本機工作台](../workbench.html?step=4)） · [流程圖](./flow.svg) · [截圖](./evidence.png)

**視像播客交接成品：**將四場劇本同路由決定帶去實驗 05。每輪口播對應一場，每輪構思一個有來源依據嘅畫面或字幕。

## 原理同 Copilot App 對照實驗

輸出要求可以同時限制口播長度同製作場數。提示詞入面嘅詞數限制唔係 API 強制詞元上限，仍然要核對結果。起稿用一次文字答覆；設計有需要先用規劃模式；多步執行確實有幫助先用代理。比較模型時，如有支援就固定推理力度；測試力度時就只改嗰項設定。

1. **輸出上限：**喺設定相同嘅新 **GPT-6.2 Sol** 對話，比較[實驗 03 嘅窄範圍提示詞](../03-context-cache/README.hk.md)同下面有限制嘅提示詞。記低格式、事實、口播詞數同可取得嘅輸出詞元數據。
2. **常規路由：**喺新嘅 **GPT-6 Luna** 對話用同一受限提示詞，同受限嘅 Sol 比較。輕量版要通過同一套核對，先可以採用。
3. **證據有衝突：**測試衝突情況時，喺受限提示詞最後加上下面另列嘅句子，路由到 **GPT-6.2 Sol**。只喺同一風險情況下比較模型；較強嘅模型都唔可以代替核對來源。

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

## 重播同檢查點

```sh
npm run bench -- --step 4
npm run bench -- --step 4 --case conflicting
# 可選：為選定情況做一次 SDK 實驗，共三次請求
npm run bench -- --step 4 --live
# 改測衝突情況，就喺最後加 --case conflicting。
```

重播嘅候選輸出由 280 減到 90 個詞元。揀來源有衝突時，候選路由由 GPT-6 Luna 轉做 GPT-6.2 Sol。重播同時改兩個變數；要獨立測試上限，就比較長、短兩份 Sol 劇本；要測模型，就喺常規情況比較受限嘅 Sol 同 Luna。

**檢查點：**四輪口播、唔多過 85 個口播詞、保留三項事實原句，每輪都有一個畫面或字幕構思。構思係審核筆記，唔係 CLI 讀取嘅欄位。**常見陷阱：**就算平，加入冇根據嘅講法、場數唔啱或者要大量返工，都唔算過關。

[← 實驗 03](../03-context-cache/README.hk.md) · [實驗 05 →](../05-budget-release/README.hk.md)
