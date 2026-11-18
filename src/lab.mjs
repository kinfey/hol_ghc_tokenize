export const model = 'gpt-6.2-sol';
export const lightweight = 'gpt-6-luna';
export const rates = {
  [model]: [2, 0.10, 2.50, 10],
  [lightweight]: [0.10, 0.01, 0.125, 0.50],
};
export const lanes = ['input', 'cacheRead', 'cacheWrite', 'output'];
export const facts = [
  'Rainwater feeds the garden.',
  'The tank holds 200 liters.',
  'Volunteers check the filter every Friday.',
];
export const contract = `Write an English podcast dialogue about a community garden. Include these exact sentences, without changing any fact:\n${facts.join('\n')}\nAlternate Host: and Guest: lines. No title, Markdown or stage directions.`;
const broad = Array.from({ length: 10 }, (_, i) =>
  `Archive ${i + 1}: Previous season notes about microphones, theme music, studio furniture, lighting, and scheduling. These notes do not contain episode facts.`).join('\n');
export const baseline = `You are a friendly, helpful podcast producer. We'd love it if you took a little time to make a polished and substantial script for our listeners, with an opening, background, several conversational exchanges and a closing. Please aim for 180–220 spoken English words.\n\n${contract}\n\n${broad}`;
export const tight = `${contract}\nExactly four lines and at most 85 spoken words.`;
export const compressed = `${contract}\nAim for 180–220 spoken English words with an opening and closing.\n\n${broad}`;
export const scoped = `${contract}\nAim for 180–220 spoken English words with an opening and closing.`;
export const ambiguity = 'The producer notes conflict about the tank size. Treat the three verified sentences above as authoritative; do not mention unverified details.';
export const episode = [
  'Host: Welcome to The Community Garden. Rainwater feeds the garden.',
  'Guest: The tank holds 200 liters. It helps the team make better use of the rain.',
  'Host: Who keeps the system ready for the next shower?',
  'Guest: Volunteers check the filter every Friday. Thanks for listening!',
].join('\n');

export function rubric(text, maxWords = Infinity, expectedLines) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const words = lines.join(' ').replace(/\b(?:Host|Guest):/g, '').trim().match(/\S+/g)?.length ?? 0;
  const checks = {
    format: lines.length >= 4 && (!expectedLines || lines.length === expectedLines)
      && lines.every((line, i) => (i % 2 ? /^Guest:\s+\S/ : /^Host:\s+\S/).test(line)),
    facts: facts.every(fact => text.includes(fact)),
    output: words <= maxWords,
  };
  return { ...checks, words, pass: Object.values(checks).every(Boolean) };
}

export function usd(usage, modelId = model) {
  const price = rates[modelId];
  if (!price || lanes.some(key => !Number.isSafeInteger(usage[key]) || usage[key] < 0)) {
    throw new Error('Unsupported rates or invalid token buckets');
  }
  return lanes.reduce((sum, key, i) => sum + usage[key] * price[i], 0) / 1e6;
}

export function route(complexity) {
  if (complexity === 'routine') return lightweight;
  if (complexity === 'conflicting') return model;
  throw new Error('Unknown complexity');
}

export function admit({ quote, spent, ceiling, checksPass = true }) {
  if (![quote, spent, ceiling].every(n => Number.isFinite(n) && n >= 0)) {
    throw new Error('Invalid budget values');
  }
  return checksPass && spent + quote <= ceiling;
}

export const labs = [
  { slug: '01-baseline', labels: ['Broad baseline', 'Same fixture for calibration'], prompts: [baseline, baseline], titles: ['Measure the baseline', '测量基线', '量度基準'], times: 15 },
  { slug: '02-compress', labels: ['Broad baseline', 'Compressed prompt'], prompts: [baseline, compressed], titles: ['Compress the prompt', '压缩提示词', '壓縮提示詞'], times: 15 },
  { slug: '03-context-cache', labels: ['Broad context / cold', 'Scoped context / warm'], prompts: [compressed, scoped], titles: ['Scope context and test reuse', '收窄上下文并测试复用', '收窄上下文並測試重用'], times: 20 },
  { slug: '04-output-routing', labels: ['Unbounded / Sol', 'Bounded / route by risk'], prompts: [scoped, tight], titles: ['Bound output and route by risk', '约束输出并按风险路由', '限制輸出並按風險路由'], times: 20 },
  { slug: '05-budget-release', labels: ['Baseline mix', 'Budgeted release'], prompts: [baseline, tight], titles: ['Gate the release on quality and cost', '用质量和成本门控发布', '以質素及成本把關發佈'], times: 20 },
];

const fixtures = [
  [[1260, 0, 0, 280], [1260, 0, 0, 280]],
  [[1260, 0, 0, 280], [1210, 0, 0, 280]],
  [[1210, 0, 0, 280], [310, 420, 0, 280]],
  [[730, 0, 0, 280], [725, 0, 0, 90]],
  [[1260, 0, 0, 280], [310, 350, 70, 90]],
];

export function replay(step, complexity = 'routine', ceiling = 0.005, spent = 0.001) {
  const lab = labs[step - 1];
  if (!lab) throw new Error('Step must be 1–5');
  return fixtures[step - 1].map((counts, i) => {
    const modelId = i === 1 && step >= 4 ? route(complexity) : model;
    const usage = Object.fromEntries(lanes.map((key, j) => [key, counts[j]]));
    const cost = usd(usage, modelId);
    const quality = rubric(episode, step >= 4 && i === 1 ? 85 : Infinity, step >= 4 && i === 1 ? 4 : undefined);
    return { label: lab.labels[i], model: modelId, usage, cost, quality, allowed: admit({ quote: cost, spent, ceiling, checksPass: quality.pass }) };
  });
}
