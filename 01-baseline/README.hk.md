# 實驗 01 · 量度基準

[English](./README.md) · [简体中文](./README.zh.md) · **繁體中文（香港）**

15 分鐘 · 原簡報第 2–7、11 頁 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=1)（[本機工作台](../workbench.html?step=1)） · [流程圖](./flow.svg) · [截圖](./evidence.png)

**視像播客交接成品：**由[來源 JSON](../examples/garden.json)整一份基準配音稿同三項事實核對清單，兩樣一齊帶去實驗 02。

## 原理

詞元係模型切分文字得出嘅片段，唔等於字詞或字元。隱藏指示、對話歷史、檔案上下文同工具定義，都可以將短提示詞變成長請求。可見文字、即時用量同輸出質素要分開量度。唔同語言嘅分詞可以唔同，唔好靠一句例句排高低。

## Copilot App 對照實驗

1. 開啟 `examples/garden.json`，搵出節目標題、提供嘅文字同參考網址。用下面三項已核實事實，標記原文入面各自嘅依據，唔使自動擷取網址內容。
2. 開新嘅純文字對話，揀 **GPT-6.2 Sol**，原樣提交下面嘅提示詞。保留配音稿，記低口播詞數（唔計講者標籤）、事實覆蓋情況同任何新增講法。實驗 02 保持模型同來源事實不變。

```text
You are a friendly, helpful podcast producer. We'd love it if you took a little time to make a polished and substantial script for our listeners, with an opening, background, several conversational exchanges and a closing. Please aim for 180–220 spoken English words.

Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.

Archive note: Previous season notes about microphones, theme music, studio furniture, lighting, and scheduling contain no episode facts.
```

## 重播同檢查點

```sh
npm run bench -- --step 1
# 可選：發送一次 SDK 基準請求
npm run bench -- --step 1 --live
```

搵出輸入、快取讀取、快取寫入同輸出四類用量。固定樣本有 1,260 個輸入詞元同 280 個輸出詞元，冇快取用量，估算係 **0.00532 美元**。另外，用同一分詞器比較工作台入面短句嘅英文、簡體中文同繁體中文版本。SDK 樣本嘅舊筆記比呢個 App 例子長，唔好當兩者係同一個請求咁比較詞元總數。

**檢查點：**保留有來源依據嘅配音稿、三項已核實事實同基準量度結果。**常見陷阱：**有連結唔代表睇過；估算值唔係帳單。

[← 工作坊首頁](../README.hk.md) · [實驗 02 →](../02-compress/README.hk.md)
