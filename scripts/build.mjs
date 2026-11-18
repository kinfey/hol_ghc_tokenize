import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import MarkdownIt from 'markdown-it';
import { encode } from 'gpt-tokenizer/encoding/o200k_base';
import { labs, episode, usd } from '../src/lab.mjs';

const md = new MarkdownIt({ html: false, linkify: true });
const locales = [
  { lang: 'en', suffix: '', name: 'English', home: 'Workshop', labs: 'Workshop labs' },
  { lang: 'zh-Hans', suffix: '.zh', name: '简体中文', home: '工作坊', labs: '实验导航' },
  { lang: 'zh-Hant-HK', suffix: '.hk', name: '繁體中文', home: '工作坊', labs: '實驗導航' },
];
const destination = l => `index${l.suffix}.html`;
const page = ({ title, locale, root = './', translations = true, body }) => `<!doctype html>
<html lang="${locale.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Five hands-on labs on GitHub Copilot token economics for a video podcast.">
<link rel="icon" href="${root}assets/copilot.svg" type="image/svg+xml">
<link rel="stylesheet" href="${root}assets/site.css"><title>${title} · Token Studio</title></head>
<body><header class="top"><div class="wrap top-inner">
<a class="brand" href="${root}${destination(locale)}"><img alt="" src="${root}assets/copilot.svg"> Token Studio</a>
<nav aria-label="Languages">${translations ? locales.map(l => `<a href="./${destination(l)}" lang="${l.lang}" ${l === locale ? 'aria-current="page"' : ''}>${l.name}</a>`).join('') : locales.map(l => `<a href="./${destination(l)}" lang="${l.lang}">${l.name}</a>`).join('')}</nav>
<a class="repo" href="https://github.com/kinfey/hol_ghc_tokenize"><img src="${root}assets/github.svg" alt=""> GitHub</a>
</div></header>${body}<footer class="wrap footer">Video Podcast Studio <span> / </span> GitHub Copilot token economics workshop</footer></body></html>`;

function renderMarkdown(raw) {
  const rewrite = value => value.replace(/README(\.zh|\.hk)?\.md(?=$|[#?])/g, (_, suffix = '') => `index${suffix}.html`);
  const tokens = md.parse(raw, {});
  for (const token of tokens) for (const child of token.children ?? []) {
    if (child.type === 'link_open') child.attrSet('href', rewrite(child.attrGet('href')));
  }
  return md.renderer.render(tokens, md.options, {});
}

await rm(new URL('../dist/', import.meta.url), { force: true, recursive: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('examples', 'dist/examples', { recursive: true });
await cp('src/lab.mjs', 'dist/lab.mjs');
await cp('src/vlog.mjs', 'dist/vlog.mjs');
const tokenizerBundle = await readFile('node_modules/gpt-tokenizer/dist/o200k_base.js', 'utf8');
await writeFile('dist/assets/tokenizer.js', tokenizerBundle.replace(/^\/\/# sourceMappingURL=.*$/m, ''));
await cp('node_modules/gpt-tokenizer/LICENSE', 'dist/assets/gpt-tokenizer-LICENSE.txt');
const phrases = ['Write a video podcast about rainwater.', '写一段关于雨水的视频播客。', '寫一段關於雨水的視像播客。'];
await writeFile('dist/proxy.mjs', `export const proxy = ${JSON.stringify(labs.map(lab => lab.prompts.map(prompt => encode(prompt).length)))};
export const language = ${JSON.stringify(phrases.map(text => [text, encode(text).length]))};\n`);
for (const [index, locale] of locales.entries()) {
  for (const [i, lab] of [null, ...labs].entries()) {
    const dir = lab ? `${lab.slug}/` : '';
    const root = lab ? '../' : './';
    const raw = await readFile(`${dir}README${locale.suffix}.md`, 'utf8');
    const nav = labs.map((l, j) => `<a href="${root}${l.slug}/${destination(locale)}"${l === lab ? ' aria-current="page"' : ''}><small>0${j + 1}</small>${l.titles[index]}</a>`).join('');
    await mkdir(`dist/${dir}`, { recursive: true });
    await writeFile(`dist/${dir}${destination(locale)}`, page({
      title: lab?.titles[index] ?? locale.home, locale, root,
      body: `<main class="wrap doc-layout"><aside class="guide"><p class="eyebrow">${locale.labs}</p>${nav}<a class="action" href="${root}workbench.html${lab ? `?step=${i}` : ''}">Open Workbench →</a></aside><article>${renderMarkdown(raw)}</article></main>`,
    }));
    if (lab && index === 0) {
      await cp(`${dir}flow.svg`, `dist/${dir}flow.svg`);
      for (const asset of ['evidence.png', 'comparison.png', 'vlog.png']) {
        await cp(`${dir}${asset}`, `dist/${dir}${asset}`).catch(error => {
          if (error.code !== 'ENOENT') throw error;
        });
      }
    }
  }
}

const live = JSON.parse(await readFile('public/evidence/lab-02-live.json', 'utf8'));
const liveTable = `<section class="pane compare" id="live-comparison" aria-labelledby="live-title" hidden>
  <p class="eyebrow">LAB 02 · RECORDED LIVE SDK RUN</p><h2 id="live-title">Observed A/B: GPT-6.2 Sol</h2>
  <p>Same episode, model, archive and 180–220-word target. Two fresh SDK sessions, one result per variant. Both cuts passed the format and fact checks. This is one observation, not a savings guarantee.</p>
  <div class="table-wrap" tabindex="0"><table><thead><tr>${['Treatment', 'Visible brief', 'SDK input', 'Cache read', 'Cache write', 'SDK output', 'Words', 'Est. USD'].map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead>
  <tbody>${live.observations.map(row => `<tr><th scope="row">${row.label}</th>${[row.prompt, row.input, row.cacheRead, row.cacheWrite, row.output, row.words].map(n => `<td>${n.toLocaleString('en-US')}</td>`).join('')}<td>$${usd(row, live.model).toFixed(7)}</td></tr>`).join('')}</tbody></table></div>
  <p class="fine">${live.date} · Default-tier list-price estimate, not the account invoice · <a href="./evidence/lab-02-live.json">Download recorded counters</a></p></section>`;
await writeFile('dist/workbench.html', page({
  title: 'Video Podcast Workbench', locale: locales[0], translations: false,
  body: `<main id="workbench" class="wrap">
  <div class="hero"><p class="eyebrow"><span class="dot"></span> HANDS-ON LAB · DETERMINISTIC REPLAY</p>
    <h1>Video Podcast Workbench</h1>
    <p>One episode, five experiments. Follow the same screenplay from source packet to rendered vlog.</p>
    <div class="tech"><span><img src="./assets/copilot.svg" alt=""> GitHub Copilot App</span><span><img src="./assets/microsoft.svg" alt=""> Microsoft Copilot SDK</span><span>GPT-6.2 Sol</span><span><img src="./assets/hyperframes.svg" alt=""> HyperFrames</span><span><img src="./assets/playwright.svg" alt=""> Playwright</span></div>
  </div><nav id="steps" aria-label="Experiments" class="steps">${labs.map((l, i) => `<a href="?step=${i + 1}"><b>0${i + 1}</b> ${l.slug.slice(3).replaceAll('-', ' ')}</a>`).join('')}</nav>
  <section class="pane experiment" aria-labelledby="lab-title">
    <div class="row"><div><p id="kicker" class="eyebrow"></p><h2 id="lab-title"></h2></div><a id="lesson" class="action">Read lab guide →</a></div>
    <p id="objective"></p>
    <form id="controls"><div id="route-control"><label for="complexity">Source risk</label><select id="complexity"><option value="routine">Routine</option><option value="conflicting">Conflicting sources</option></select></div>
    <div id="budget-control"><label for="budget">Ceiling (USD)</label><input id="budget" type="number" value="0.005" min="0" step="0.000001" required></div>
    <button class="primary" type="submit">Run replay</button></form>
    <div id="result" aria-live="polite"></div><p id="proxy" class="fine"></p>
  </section>
  <section class="pane compare" aria-labelledby="tokenizer-title"><p class="eyebrow">A/B TOKENIZER · LOCAL ONLY</p><h2 id="tokenizer-title">Compare your own prompts</h2>
    <p>Start with the current lab’s briefs or paste any two texts. This counts visible text with <code>o200k_base</code>, not Copilot’s hidden context or actual billed usage. Text stays in your browser.</p>
    <form id="tokenizer"><div class="two"><label>Before <textarea id="before" rows="5" maxlength="8000" required></textarea></label><label>After <textarea id="after" rows="5" maxlength="8000" required></textarea></label></div>
    <button class="primary" type="submit">Compare tokens</button><button type="button" id="reset">Reset to lab prompts</button><p id="comparison" aria-live="polite"></p></form></section>
  ${liveTable}
  <div class="two">
    <section class="pane"><p class="eyebrow">01 / INPUT &amp; CONTRACT</p><h2>Production brief</h2><p id="brief-intro"></p><details><summary>Inspect the baseline prompt</summary><pre id="baseline"></pre></details><details><summary>Inspect the candidate prompt</summary><pre id="candidate"></pre></details>
    <details><summary>Make a source packet</summary><form id="packet"><label>Episode title <input name="title" maxlength="90" required></label><label>Source text and excerpts <textarea name="content" rows="4" maxlength="6000" required></textarea></label><label>Reference URLs (one per line; not fetched) <textarea name="links" rows="3" maxlength="545"></textarea></label><button type="submit">Download episode.json</button><p id="packet-status" aria-live="polite"></p></form></details></section>
    <section class="pane"><p class="eyebrow">02 / SCREENPLAY</p><h2>Reference cut</h2><p>The same human-reviewed fixture anchors every experiment. Its text is not the measured output of the synthetic counters.</p><pre class="screenplay">${episode}</pre></section>
  </div>
  <section class="pane player" id="sample"><p class="eyebrow">03 / HYPERFRAMES OUTPUT</p><h2>The Community Garden</h2><p>Sample video podcast from the shared source packet. All model calls and custom renders run locally, not on Pages.</p><video src="./media/garden.mp4" controls preload="metadata" playsinline aria-label="The Community Garden video podcast"></video><p><a href="./05-budget-release/index.html">Render your episode locally →</a></p></section>
  </main><script type="module" src="./assets/workbench.mjs"></script>`,
}));
await writeFile('dist/.nojekyll', '');
