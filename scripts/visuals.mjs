import { mkdir, readFile, writeFile } from 'node:fs/promises';
import octicons from '@primer/octicons';
import { labs } from '../src/lab.mjs';

const stages = [
  [['Source packet', 'Text and reference URLs'], ['Draft screenplay', 'Copilot App + GPT-6.2 Sol'], ['Record baseline', 'SDK usage and rubric']],
  [['Lock the facts', 'Same episode and output target'], ['Compress the brief', 'Remove filler, retain constraints'], ['Compare A/B', 'Prompt tokens and fact checks']],
  [['Scope the evidence', 'Use only verified excerpts'], ['Repeat a prefix', 'Observe actual cache counters'], ['Compare lanes', 'Input, cache read, cache write']],
  [['Cap the edit', 'Four scenes; 85 spoken words'], ['Route by risk', 'Routine vs. conflicting sources'], ['Validate dialogue', 'Script contract and human review']],
  [['Check the budget', 'Synthetic estimate, not a hard cap'], ['Render the episode', 'HyperFrames + local narration'], ['Release evidence', 'MP4, sources and Playwright']],
];
const ms = '<path fill="#f25022" d="M0 0h7v7H0z"/><path fill="#7fba00" d="M8 0h7v7H8z"/><path fill="#00a4ef" d="M0 8h7v7H0z"/><path fill="#ffb900" d="M8 8h7v7H8z"/>';
const copilot = octicons.copilot.toSVG().match(/<path.*<\/path>/)[0];
const oct = key => octicons[key].toSVG().replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" fill="#eef4ff" ');
await mkdir('public/assets', { recursive: true });
await writeFile('public/assets/copilot.svg', oct('copilot'));
await writeFile('public/assets/github.svg', oct('mark-github'));
await writeFile('public/assets/microsoft.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">${ms}</svg>`);
const hyperframes = (await readFile('public/assets/hyperframes.svg', 'utf8'))
  .replace('<svg ', '<svg x="427" y="229" ').replace('width="100" height="100"', 'width="19" height="19"');
const playwright = (await readFile('public/assets/playwright.svg', 'utf8'))
  .replace('<svg ', '<svg x="548" y="229" ').replace('width="400" height="400"', 'width="19" height="19"');
for (const [i, lab] of labs.entries()) {
  await mkdir(lab.slug, { recursive: true });
  const boxes = stages[i].map(([title, detail], j) => {
    const x = 25 + j * 310;
    return `<rect x="${x}" y="104" width="270" height="106" rx="14" fill="#17283c" stroke="#41607e"/>
    <text x="${x + 16}" y="135" fill="#7af6d0" font-size="12" font-weight="700">0${j + 1}</text>
    <text x="${x + 16}" y="163" fill="#f4f8ff" font-size="20" font-weight="700">${title}</text>
    <text x="${x + 16}" y="187" fill="#c4d3e2" font-size="13">${detail}</text>
    ${j < 2 ? `<path d="M${x + 277} 155h24m-6-6 6 6-6 6" fill="none" stroke="#7af6d0" stroke-width="2"/>` : ''}`;
  }).join('\n');
  await writeFile(`${lab.slug}/flow.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 270" role="img" aria-labelledby="title description" font-family="system-ui,sans-serif">
  <title id="title">${lab.titles[0]}</title><desc id="description">${stages[i].map(([name]) => name).join(', then ')}</desc>
  <rect width="940" height="270" rx="22" fill="#101b2c"/>
  <text x="25" y="34" fill="#81f6d2" font-size="13" letter-spacing="2">VIDEO PODCAST STUDIO  /  LAB 0${i + 1}</text>
  <text x="25" y="73" fill="#f4f8ff" font-size="29" font-weight="700">${lab.titles[0]}</text>
  ${boxes}
  <g transform="translate(25 231)" fill="#f4f8ff">${copilot}</g>
  <text x="49" y="243" fill="#c4d3e2" font-size="13">GitHub Copilot App</text>
  <g transform="translate(193 232)">${ms}</g>
  <text x="218" y="243" fill="#c4d3e2" font-size="13">Microsoft Copilot SDK</text>
  ${hyperframes}<text x="451" y="243" fill="#c4d3e2" font-size="13">HyperFrames</text>
  ${playwright}<text x="571" y="243" fill="#c4d3e2" font-size="13">Playwright</text>
  <text x="669" y="243" fill="#c4d3e2" font-size="13">GPT-6.2 Sol</text>
</svg>\n`.replace(/[ \t]+$/gm, ''));
}
