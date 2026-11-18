import { parseArgs } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import { encode } from 'gpt-tokenizer/encoding/o200k_base';
import { labs, replay, model, route, admit, rubric, scoped, tight, ambiguity } from '../src/lab.mjs';

const { values } = parseArgs({ options: {
  step: { type: 'string', default: '1' },
  case: { type: 'string', default: 'routine' },
  budget: { type: 'string', default: '0.005' },
  spent: { type: 'string', default: '0.001' },
  live: { type: 'boolean', default: false },
  models: { type: 'boolean', default: false },
} });
const step = Number(values.step);
const complexity = values.case;
const ceiling = Number(values.budget);
const spent = Number(values.spent);
const lab = labs[step - 1];
if (!lab || !values.budget.trim() || !values.spent.trim()) throw new Error('Enter a lab 1–5 and valid budget values.');
const routed = route(complexity);
const simulated = replay(step, complexity, ceiling, spent);
const promptCounts = lab.prompts.map(prompt => encode(prompt).length);

if (values.models) {
  const { CopilotClient } = await import('@github/copilot-sdk');
  const client = new CopilotClient();
  try {
    await client.start();
    const auth = await client.getAuthStatus();
    if (!auth.isAuthenticated) throw new Error('Sign into Copilot CLI before checking models.');
    console.log(JSON.stringify({ authenticated: true, available: (await client.listModels()).some(({ id }) => id === model) }));
  } finally { await client.stop(); }
} else if (!values.live) {
  console.log(JSON.stringify({
    source: 'synthetic-only', step, promptCounts, tokenizer: 'o200k_base (prompt-only proxy)', simulated,
    languageExample: ['Write a podcast about rainwater.', '写一段关于雨水的播客。', '寫一段關於雨水的播客。']
      .map(text => ({ text, tokens: encode(text).length })),
  }, null, 2));
} else {
  if (step === 5 && !admit({ quote: simulated[1].cost, ceiling, spent })) {
    throw new Error('Blocked by the teaching budget gate before contacting Copilot (not a billing limit).');
  }
  const { withCopilot } = await import('../src/live.mjs');
  const observations = await withCopilot(async (run) => {
    const options = step === 1 ? [['baseline', lab.prompts[0], model]]
      : step === 2 ? [['baseline', lab.prompts[0], model], ['compressed', lab.prompts[1], model]]
      : step === 3 ? [['broad', lab.prompts[0], model], ['scoped-first', scoped, model, 'reuse'],
        ['scoped-repeat', scoped, model, 'reuse']]
      : step === 4 ? [['long-sol', scoped, model], ['short-sol', tight, model],
        ['short-routed', tight, routed]]
      : [['release', tight, routed]];
    const results = [];
    for (const [label, raw, modelId, sessionKey] of options) {
      const prompt = complexity === 'conflicting' && step >= 4 ? `${raw}\n${ambiguity}` : raw;
      const runResult = await run({ prompt, modelId, sessionKey });
      const bounded = raw === tight;
      results.push({ label, promptProxyTokens: encode(prompt).length, ...runResult,
        quality: rubric(runResult.text, bounded ? 85 : Infinity, bounded ? 4 : undefined) });
    }
    return results;
  });
  const report = { source: 'sdk-observed-not-invoice', step, complexity, observations };
  await mkdir('reports', { recursive: true });
  await writeFile(`reports/lab-${step}.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.table(observations.map(({ label, model, events, quality, latencyMs }) => ({
    label, model, usageEvents: events.length, quality: quality.pass ? 'PASS' : 'FAIL', latencyMs,
  })));
  console.log(`See reports/lab-${step}.json. Missing telemetry is unknown, not zero.`);
  if (observations.some(({ quality }) => !quality.pass)) process.exitCode = 1;
}
