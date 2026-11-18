# GitHub Copilot token optimization workshop

**English** · [简体中文](./README.zh.md) · [繁體中文（香港）](./README.hk.md)

Use the **GitHub Copilot App** and **GPT-6.2 Sol** to make one **Video Podcast / Vlog** about a community garden. Start with the text and URLs in `examples/garden.json`, then carry the same episode through five stages: baseline screenplay, compressed brief, scoped evidence, capped scene plan, and release review. The dialogue is the audio script for the HyperFrames video, not a separate project.

## Workshop path

| Lab | Time | What you will test | Source slides |
| --- | ---: | --- | --- |
| [01 · Measure the baseline](./01-baseline/README.md) | 15 min | Tokenization, hidden context, and the cost of output | 2–7, 11 |
| [02 · Compress the prompt](./02-compress/README.md) | 15 min | Remove scaffolding without weakening the contract | 9–11 |
| [03 · Scope context and test reuse](./03-context-cache/README.md) | 20 min | Scope instructions and tool context; separate scoping from caching | 12–15, 21–28 |
| [04 · Bound output and route by risk](./04-output-routing/README.md) | 20 min | Compare output limits, workflow modes, models, and reasoning effort | 16–20 |
| [05 · Gate the release on quality and cost](./05-budget-release/README.md) | 20 min | Test admission limits and review podcast/vlog artifacts before release | 19, 29–31 |

## Choose a way to run the workshop

- **Browser replay:** Open the [English workbench on GitHub Pages](https://kinfey.github.io/hol_ghc_tokenize/workbench.html?step=1). It uses fixed examples; it does not call Copilot or require a sign-in. The guides are localized, but the workbench, prompts, and example episode are English so everyone tests the same inputs.
- **Local replay:** Use Node.js **22.12 or later** and npm. From the repository root, run:

  ```sh
  npm ci
  npm run build
  npm run serve
  ```

  Open the local URL printed by the server, or run `npm run bench -- --step 1` from another terminal. Change the step number from `1` through `5` as you work through the labs.
- **Copilot App and optional live SDK:** Sign in with an account that can use the required models. Create a fresh chat for each comparison arm unless the lab explicitly calls for reuse. Select **GPT-6.2 Sol** rather than Auto when holding the model constant. Use a simple text-only interaction; decline edits or tool calls. The App prompts and SDK commands are separate ways to run an experiment, not the same request or necessarily the same session context. Run live commands once per listed arm, only when authorized; use replay if a model is unavailable or spending is not approved.

  To check Copilot CLI authentication and GPT-6.2 Sol availability without submitting a generation request, run `npm run bench -- --models`. This does not check the App picker or guarantee access to the routed model.

## Compare prompt tokens before and after

In **Compare your own prompts**, put the original brief in **Before**, the rewrite in **After**, and choose **Compare tokens**. Change one variable at a time and keep the facts and quality bar fixed. The browser's `o200k_base` count is a **visible prompt-token proxy**, not full request usage. For example, Lab 02's bundled briefs go from **400 → 362 visible tokens**; its separate replay uses **1,260 → 1,210 synthetic input tokens** with output held constant. The displayed replay cost is calculated from those synthetic buckets, not from the local tokenizer.

Live [Copilot SDK](https://github.com/microsoft/copilot-sdk) (`@github/copilot-sdk`) usage is raw telemetry for the SDK session, not a reconstruction of the App's usage or an invoice. Full requests can include instructions, history, file context, and tool schemas that are not in the visible prompt.

The workshop defaults for **GPT-6.2 Sol** at **up to 272K context** are **US$2.00 input / $0.10 cache read / $2.50 cache write / $10.00 output per million tokens**. Estimates multiply each separate token bucket by its rate and divide by one million. Use [GitHub's Copilot models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) and your account's billing reporting for current terms and actual usage. Missing telemetry is unknown, not zero.

## Render the Video Podcast / Vlog

Run the sample from the repository root:

```sh
npm run vlog -- --input examples/garden.json
# Optional: authenticated Copilot SDK run
npm run vlog -- --input examples/garden.json --live
# Optional: render the offline sample as MP4
npm run vlog -- --input examples/garden.json --render
```

Default mode uses the bundled transcript. `--live` uses the authenticated SDK; `--script episode.txt` instead uses the approved App script, as shown in Lab 05. Each mode writes `episode.json` under `reports/vlog/fixture/`, `reports/vlog/live/`, or `reports/vlog/script/`. Optional `--render` adds `episode.mp4` and `project/index.html` in the same directory. It uses a pinned [HyperFrames](https://github.com/heygen-com/hyperframes) package, `ffmpeg`/`ffprobe`, and the macOS `say` voices Samantha and Daniel.

Supply your own JSON as `{ "title": "...", "content": "...", "links": ["https://example.com/"] }`, or use **Make a source packet** in the workbench to download one without sending its contents to a server. Links are references only and are **not fetched**; paste any relevant excerpts you have permission to reuse into `content`. Before sharing any output, check the script against the source, preview the timeline or MP4, and remove sensitive information.

## Verify and credits

Use `npm test` for automated checks and `npm run screenshots` to regenerate the lab evidence images. If Playwright reports that Chromium is missing, run `npx playwright install chromium` first.

Adapted from *GitHub Copilot Token Optimization: An engineering playbook for the Usage-Based Billing era* by **Xuefeng Yin, AI Apps GBB, Microsoft**. The source deck is not included in the public workshop.

[Start Lab 01 →](./01-baseline/README.md)
