# Lab 03 · Scope and reuse episode evidence

**English** · [简体中文](./README.zh.md) · [繁體中文（香港）](./README.hk.md)

20 minutes · Slides 12–15, 21–28 · [Pages workbench](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=3) ([local workbench](../workbench.html?step=3)) · [Flow](./flow.svg) · [Screenshot](./evidence.png)

**Video Podcast / Vlog handoff:** Keep a minimal evidence packet: the three verified sentences, their source notes, and reference URLs. Use it to support the narration and visuals in Lab 04.

## Theory

Scoping removes irrelevant material. Caching may reuse processing for an unchanged prefix; it does not make irrelevant material useful. Keep stable evidence first when designing a reusable brief, put changing instructions last, and track cache read and cache write separately. Neither an unchanged prefix nor a repeated message guarantees a cache hit.

For real projects, keep only non-negotiables in always-on instructions. Use path-scoped rules (for example `applyTo` where supported) and on-demand skills or custom agents for task-specific guidance. Reference the smallest relevant text, remove unused MCP tools, and start a fresh chat for unrelated work. If a subagent reads many sources, ask for a fact-checked digest, not a dump; delegation still has a cost.

## Copilot App experiment

1. **Scoping only:** Compare the [exact Lab 02 B prompt](../02-compress/README.md) with the scoped prompt below in two fresh **GPT-6.2 Sol** chats. Only the irrelevant archive note is removed. Keep the references in production notes; do not attach the archive or ask Copilot to fetch the URLs.
2. **Reuse only:** Treat the first scoped request as the cold candidate, then submit the identical block once in that scoped chat as a warm candidate. Keep the text, settings, and model unchanged. Compare cache reads/writes only where telemetry is available. The second turn also adds conversation history, so a change in total input alone is not proof of reuse. If no cache signal appears, record “not observed.”

```text
Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:
Rainwater feeds the garden.
The tank holds 200 liters.
Volunteers check the filter every Friday.
Alternate Host: and Guest: lines. No title, Markdown or stage directions.
Aim for 180–220 spoken English words. Include an opening, background, several exchanges, and a closing.
```

## Replay and checkpoint

```sh
npm run bench -- --step 3
# Optional: three SDK requests (broad, scoped first, scoped repeat)
npm run bench -- --step 3 --live
```

The bundled briefs drop from **362 → 72 visible prompt tokens** as the archive is removed. Separately, the fixed replay combines broad/cold and scoped/warm: 1,210 synthetic input and zero cache read versus 310 input and 420 cache read. The replay cost illustrates both levers together; it cannot tell you how much each contributed. For that, use the separate comparisons above.

**Checkpoint:** Every fact still has a source note, the dialogue doesn't use the removed material, and your notes distinguish fewer visible tokens from actual cache telemetry. **Pitfall:** Reordering or editing the prefix changes what can be reused; don't assume cache reads are free or cache writes didn't happen.

[← Lab 02](../02-compress/README.md) · [Lab 04 →](../04-output-routing/README.md)
