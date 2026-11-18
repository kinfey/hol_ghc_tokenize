# Lab 04 · Cap the scene plan and route by risk

**English** · [简体中文](./README.zh.md) · [繁體中文（香港）](./README.hk.md)

20 minutes · Slides 16–20 · [Pages workbench](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=4) ([local workbench](../workbench.html?step=4)) · [Flow](./flow.svg) · [Screenshot](./evidence.png)

**Video Podcast / Vlog handoff:** Bring a four-scene screenplay and a routing decision to Lab 05. Map one spoken turn to each scene and sketch a source-backed visual or caption for each turn.

## Theory and Copilot App experiment

An output contract limits the narration and the number of scenes to produce. A word limit in a prompt is not a hard API token limit; validate the result. Use a single text answer for drafting, a planning mode for design when needed, and an agent for multi-step execution only when it adds value. Keep reasoning effort fixed where supported while testing a model change; when testing effort, change only that setting.

1. **Output cap:** In fresh **GPT-6.2 Sol** chats with the same settings, compare the [Lab 03 scoped prompt](../03-context-cache/README.md) with the bounded prompt below. Record the format, facts, spoken word count, and any available output-token observations.
2. **Routine route:** Reuse the bounded block in a fresh **GPT-6 Luna** chat and compare against bounded Sol. Accept the lightweight cut only if it passes the same checks.
3. **Conflicting evidence:** Append the line shown below to the bounded prompt when testing the conflict scenario. Route it to **GPT-6.2 Sol**. Compare models only within the same risk case and never let a stronger model substitute for source review.

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

## Replay and checkpoint

```sh
npm run bench -- --step 4
npm run bench -- --step 4 --case conflicting
# Optional: one SDK run for the chosen case; three requests
npm run bench -- --step 4 --live
# To run the conflicting case instead, append --case conflicting.
```

In replay, the candidate output drops from 280 to 90 tokens. Its route changes from GPT-6 Luna to GPT-6.2 Sol when you choose conflicting sources. The replay rows combine both levers; bounded Sol versus longer Sol isolates the cap, and bounded Sol versus bounded Luna isolates the model for routine sources.

**Checkpoint:** You have four turns, no more than 85 spoken words, all three exact facts, and a frame or caption idea for each turn. The sketches are review notes, not fields read by the CLI. **Pitfall:** Cheap output that adds an unsupported claim, breaks scene count, or needs costly rework has not passed.

[← Lab 03](../03-context-cache/README.md) · [Lab 05 →](../05-budget-release/README.md)
