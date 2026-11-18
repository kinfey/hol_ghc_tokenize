# Lab 05 · Gate the render and release

**English** · [简体中文](./README.zh.md) · [繁體中文（香港）](./README.hk.md)

20 minutes · Slides 19, 29–31 · [Pages workbench](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=5) ([local workbench](../workbench.html?step=5)) · [Flow](./flow.svg) · [Screenshot](./evidence.png)

**Video Podcast / Vlog handoff:** Produce a release decision and a reviewed scene timeline; if you render the episode, also review the MP4. Use the same source packet, facts, and four-scene contract from Labs 01–04.

## Theory and Copilot App experiment

Admit a candidate only if its checks pass and spent + estimated request cost stays at or below the ceiling. Test the decision before generating or rendering. A teaching gate does not enforce an account limit: use GitHub's organizational budgets and cost centers for actual governance, and track rendering or retry costs separately.

In a new **GPT-6.2 Sol** chat, review the reference screenplay with this exact prompt. To test the quality gate, change only `200 liters` to `300 liters` in the candidate dialogue (not in the verified facts) and repeat in a fresh chat with identical settings. Expect `PASS` for the reference and `FAIL` for the changed fact; independently check both decisions. Then use the same review criteria on the Lab 04 candidate and the generated timeline.

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

## Replay the budget gate

```sh
npm run bench -- --step 5
npm run bench -- --step 5 --budget 0.001
# Optional: one SDK request for the admitted candidate, not a render
npm run bench -- --step 5 --live
```

At the default **US$0.005** ceiling with **US$0.001** already spent, the replay blocks the baseline and admits the routine candidate. Lower the ceiling to **US$0.001** and both are blocked: the same screenplay can pass quality but fail budget. Step 5's live benchmark checks its teaching quote before submitting; the vlog CLI is a separate command and is not blocked by that gate. Use the result as a manual checkpoint, not a promise about charges.

## Render and verify

Use the [sample source JSON](../examples/garden.json), or select **Make a source packet** in the workbench to download a JSON file in your browser. The browser does not submit its contents; URLs are references only and are not fetched. Put relevant excerpts you may reuse into `content`.

```sh
npm run vlog -- --input examples/garden.json
# Optional: one authenticated SDK generation, only after approval
npm run vlog -- --input examples/garden.json --live
# Optional: render the offline sample as a narrated MP4
npm run vlog -- --input examples/garden.json --render
```

To carry the **exact approved App cut** from Lab 04 into production, save only its four `Host:`/`Guest:` lines as UTF-8 `episode.txt` in the repository root. Add `--render` to the following command for the narrated video; do not combine `--script` and `--live`.

```sh
npm run vlog -- --input examples/garden.json --script episode.txt
```

Default mode uses the bundled transcript; `--live` generates new dialogue from the source packet. The three modes write `episode.json` (script and timeline) under `reports/vlog/fixture/`, `reports/vlog/live/`, or `reports/vlog/script/`. `--render` adds `episode.mp4` and `project/index.html` in the same mode directory. For narrated rendering, use macOS with `say` voices **Samantha** and **Daniel**, plus `ffmpeg` and `ffprobe`; the script invokes a pinned HyperFrames package. For an approved live render, combine `--live --render` instead of generating live twice.

**Checkpoint:** Confirm all facts against the source, match one scene to each speaker turn, and check captions, narration, scene transitions, and playback before sharing. Note approval or the blocker. **Pitfall:** Only `--script` uses your App dialogue. Review the actual `episode.json` and MP4, and never share private sources or stale artifacts.

[← Lab 04](../04-output-routing/README.md) · [Workshop home →](../README.md)
