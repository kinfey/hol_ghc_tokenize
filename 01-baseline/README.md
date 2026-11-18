# Lab 01 · Measure the baseline

**English** · [简体中文](./README.zh.md) · [繁體中文（香港）](./README.hk.md)

15 minutes · Slides 2–7, 11 · [Work in the Pages workbench](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=1) ([local workbench](../workbench.html?step=1)) · [Flow](./flow.svg) · [Screenshot](./evidence.png)

**Video Podcast / Vlog handoff:** Turn [the source JSON](../examples/garden.json) into a baseline narration draft and a three-fact checklist. Bring both to Lab 02.

## Theory

Tokens are model-dependent pieces of text, not words or characters. Hidden instructions, history, file context, and tool definitions can make a short visible prompt into a large request. Measure visible text, live usage, and output quality separately. Different languages can tokenize differently; one sentence cannot establish a universal ranking.

## Copilot App experiment

1. Open `examples/garden.json`. Identify the episode title, supplied text, and reference URLs; use the three verified sentences below. No automatic URL fetch is needed. Note which supplied text supports each fact.
2. In a fresh text-only chat, select **GPT-6.2 Sol** and submit this exact prompt. Save the draft and note its spoken word count (exclude speaker labels), fact coverage, and any extra claims. Keep the same source facts and model for Lab 02.

```text
You are a friendly, helpful podcast producer. We'd love it if you took a little time to make a polished and substantial script for our listeners, with an opening, background, several conversational exchanges and a closing. Please aim for 180–220 spoken English words.

Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.

Archive note: Previous season notes about microphones, theme music, studio furniture, lighting, and scheduling contain no episode facts.
```

## Replay and checkpoint

```sh
npm run bench -- --step 1
# Optional: one SDK baseline request
npm run bench -- --step 1 --live
```

Find the four buckets: input, cache read, cache write, and output. The fixed baseline example has 1,260 input and 280 output tokens, no cached usage, and an estimated **US$0.00532**. Separately, compare the workbench's English, Simplified Chinese, and Traditional Chinese versions of the short phrase using the same tokenizer. The SDK fixture's archive block is larger than this App example; do not compare their token totals as the same request.

**Checkpoint:** You have one source-backed narration draft, the three verified facts, and a baseline measurement. **Pitfall:** A URL is a reference, not evidence that it was visited; a token estimate is not a bill.

[← Workshop home](../README.md) · [Lab 02 →](../02-compress/README.md)
