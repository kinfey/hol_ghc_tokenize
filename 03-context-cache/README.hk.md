# 實驗 03 · 篩選並重用節目證據

[English](./README.md) · [简体中文](./README.zh.md) · **繁體中文（香港）**

20 分鐘 · 原簡報第 12–15、21–28 頁 · [Pages 工作台](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=3)（[本機工作台](../workbench.html?step=3)） · [流程圖](./flow.svg) · [截圖](./evidence.png)

**視像播客交接成品：**保留最精簡嘅證據包，包括三項已核實原句、來源筆記同參考網址，為實驗 04 嘅口播同畫面提供依據。

## 原理

收窄範圍係刪走無關資料。快取可能重用不變前綴嘅處理結果，但唔會令無關資料變得有用。設計可重用嘅簡報時，將固定證據放前面，會變嘅指示放最後，分開記錄快取讀取同寫入。相同前綴或重複發送都唔保證命中。

實際項目只應將不可妥協嘅要求放入常駐指示。特定工作可以用有限定路徑嘅規則（如支援，可用 `applyTo`）、按需技能或自訂代理。引用最短嘅相關文字，移除唔用嘅 MCP 工具，為無關工作開新對話。如果要子代理讀多份來源，請佢交已核實嘅摘要，唔好堆砌原文；委派都有成本。

## Copilot App 對照實驗

1. **只收窄範圍：**開兩個新嘅 **GPT-6.2 Sol** 對話，比較[實驗 02 嘅 B 組原有提示詞](../02-compress/README.hk.md)同下面嘅簡報。只刪走無關舊筆記。參考網址留喺製作筆記入面，唔附加舊資料，亦唔叫 Copilot 擷取連結。
2. **只測試重用：**當首次提交收窄版係冷請求候選，再喺同一對話原樣提交一次，當係暖請求候選。文字、設定同模型維持不變。有遙測先比較快取讀取同寫入。第二次亦會加入對話歷史，所以輸入總量變咗唔代表有重用。冇快取訊號就記低「未觀察到」。

```text
Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.
Aim for 180–220 spoken English words. Include an opening, background, several exchanges, and a closing.
```

## 重播同檢查點

```sh
npm run bench -- --step 3
# 可選：三次 SDK 請求（闊範圍、首次窄範圍、重複窄範圍）
npm run bench -- --step 3 --live
```

刪走舊筆記之後，內置簡報由 **362 減到 72 個可見提示詞元**。另一邊固定重播合併咗兩個變數：「闊範圍／冷」有 1,210 個模擬輸入詞元，冇快取讀取；「窄範圍／暖」有 310 個輸入詞元、420 個快取讀取詞元。重播成本示範兩種方法一齊用，唔可以分別歸因；請用上面兩組獨立比較。

**檢查點：**每項事實仍然有來源筆記，份稿冇用已移除資料，筆記清楚區分可見詞元減少同實際快取遙測。**常見陷阱：**改動或調換前綴次序會改變可重用嘅內容；快取讀取唔係免費，亦唔好假設冇快取寫入。

[← 實驗 02](../02-compress/README.hk.md) · [實驗 04 →](../04-output-routing/README.hk.md)
