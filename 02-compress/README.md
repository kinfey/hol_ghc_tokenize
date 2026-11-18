# Lab 02 · Compress the screenplay brief

**English** · [简体中文](./README.zh.md) · [繁體中文（香港）](./README.hk.md)

15 minutes · Slides 9–11 · [Pages workbench](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=2) ([local workbench](../workbench.html?step=2)) · [Flow](./flow.svg) · [Screenshot](./evidence.png)

**Video Podcast / Vlog handoff:** Keep a shorter screenplay brief for the same episode. Carry the accepted brief and its fact checklist into evidence scoping in Lab 03.

## Theory and Copilot App experiment

Compress wording, not requirements. Remove pleasantries and redundant instructions; keep domain facts, output format, and acceptance criteria explicit. A structured brief is easier to audit. Avoid assuming that a change in language necessarily lowers token count.

Use the [exact Lab 01 prompt](../01-baseline/README.md) as A. Use B below in a fresh **GPT-6.2 Sol** chat with the same settings. Only the brief wording/order changes; the archive note, facts, speaker format, and target length stay the same. Compare prompt-only tokens and read the results side by side for the same production requirements.

```text
Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.
Aim for 180–220 spoken English words. Include an opening, background, several exchanges, and a closing.

Archive note: Previous season notes about microphones, theme music, studio furniture, lighting, and scheduling contain no episode facts.
```

## Replay and checkpoint

```sh
npm run bench -- --step 2
# Optional: one request per SDK arm, two total
npm run bench -- --step 2 --live
```

**Before → after:** The bundled briefs drop from **400 → 362 visible prompt tokens** (38 fewer, 9.5%). In **Compare your own prompts**, paste the App versions to measure their own before/after; their archive block differs from the bundled briefs. Separately, the replay uses **1,260 → 1,210 synthetic input tokens** with output fixed at 280 and caching at zero. The shown cost estimates use these replay buckets, not the visible prompt count. The rubric checks dialogue shape and exact facts, not pacing or the 180–220 word aim; inspect those yourself.

**Observed SDK A/B:** In one fresh-session pair, the visible brief went from **400 to 362** tokens (−9.5%), SDK input from **3,565 to 3,527**, and SDK output from **266 to 256**. Both cuts passed the format and fact checks. See the [Playwright capture](./comparison.png) and use **Compare your own prompts** in the workbench to try your own pair. The browser does not send the text to a model. One pair is not a forecast of savings.

**Checkpoint:** Select B only if it preserves the brief and the episode is still usable as narration. Note what you removed and what stayed fixed. **Pitfall:** Do not change the model, remove evidence, or impose a hard output cap in this comparison.

[← Lab 01](../01-baseline/README.md) · [Lab 03 →](../03-context-cache/README.md)
