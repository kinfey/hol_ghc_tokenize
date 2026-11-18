import { labs, replay, lanes, ambiguity } from '../lab.mjs';
import { proxy, language } from '../proxy.mjs';
import { validateInput } from '../vlog.mjs';

const $ = id => document.getElementById(id);
const step = Number(new URLSearchParams(location.search).get('step') ?? '1');
const current = labs[step - 1] ? step : 1;
const lab = labs[current - 1];
const detail = [
  ['Establish a baseline for the first cut of the video podcast.', 'The source packet is the ground truth. Separate visible prompt size from provider usage.'],
  ['Change only the wording of the screenplay brief; keep the facts, archive and target the same.', 'Removing filler should not change who speaks, what must be true, or the expected length.'],
  ['Remove unrelated archive context; then distinguish a smaller input from a cache hit.', 'The synthetic candidate shows an example of a warm run. The live benchmark tests a scoped first run and a repeated prompt separately.'],
  ['Limit the number of caption scenes and spoken words, then compare model choices.', 'Start on Sol to isolate the output cap. Route routine work only after it passes the same rubric.'],
  ['Reject over-budget candidate cuts before local rendering; keep human review in the release checklist.', 'Budget checks use a synthetic quote and $0.001 already spent. This does not enforce a GitHub billing limit.'],
];
$('steps').children[current - 1].setAttribute('aria-current', 'step');
$('kicker').textContent = `LAB 0${current}  /  ${lab.times} MIN`;
$('lab-title').textContent = lab.titles[0];
$('objective').textContent = detail[current - 1][0];
$('brief-intro').textContent = detail[current - 1][1];
$('lesson').href = `./${lab.slug}/index.html`;
$('route-control').hidden = current < 4;
$('budget-control').hidden = current !== 5;
$('live-comparison').hidden = current !== 2;
$('proxy').textContent = current === 1
  ? `Tokenizer proxy · ${language.map(([text, count], i) => `${['EN', 'ZH-Hans', 'ZH-Hant-HK'][i]} ${count}`).join(' / ')} tokens for a short example; baseline brief: ${proxy[0][0]}`
  : `Visible brief only · ${proxy[current - 1][0]} → ${proxy[current - 1][1]} proxy tokens before any risk appendix or hidden context`;

const dollars = n => `$${n.toFixed(7)}`;
const headers = ['Treatment / model', 'Input', 'Cache read', 'Cache write', 'Output', 'Est. USD', 'Fixture QA'];
function run() {
  const budget = $('budget').valueAsNumber;
  const complexity = $('complexity').value;
  const rows = replay(current, complexity, budget);
  const savings = (1 - rows[1].cost / rows[0].cost) * 100;
  $('baseline').textContent = lab.prompts[0];
  $('candidate').textContent = lab.prompts[1] + (complexity === 'conflicting' && current >= 4 ? `\n${ambiguity}` : '');
  const verdict = current === 5
    ? `<span class="pill ${rows[1].allowed ? '' : 'blocked'}">${rows[1].allowed ? 'ALLOW' : 'BLOCK'}</span><span>${dollars(rows[1].cost + 0.001)} projected of ${dollars(budget)} ceiling</span>`
    : `<span class="pill">${savings.toFixed(1)}% simulated savings</span>`;
  $('result').innerHTML = `<div class="verdict">${verdict}</div>
    <div class="table-wrap" tabindex="0"><table><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r, i) => `<tr><th scope="row"><strong>${i ? 'B' : 'A'}</strong> ${r.label}<small>${r.model}</small></th>
      ${lanes.map(l => `<td>${r.usage[l].toLocaleString('en-US')}</td>`).join('')}<td>${dollars(r.cost)}</td>
      <td>${r.quality.pass ? 'PASS' : 'FAIL'}</td></tr>`).join('')}</tbody></table></div>
    <p class="fine">Synthetic token buckets · Default context tier rates · No provider request or actual charge</p>`;
}
$('controls').addEventListener('submit', event => { event.preventDefault(); run(); });
run();

function resetComparison() {
  $('before').value = $('baseline').textContent;
  $('after').value = $('candidate').textContent;
  $('comparison').textContent = 'Ready to compare.';
}
$('reset').addEventListener('click', resetComparison);
resetComparison();

let tokenizer;
function getTokenizer() {
  return tokenizer ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL('./tokenizer.js', import.meta.url);
    script.onload = () => resolve(globalThis.GPTTokenizer_o200k_base);
    script.onerror = () => { script.remove(); tokenizer = undefined; reject(new Error('Tokenizer could not load.')); };
    document.head.append(script);
  });
}
$('tokenizer').addEventListener('submit', async event => {
  event.preventDefault();
  const [before, after] = [$('before').value, $('after').value];
  $('comparison').textContent = 'Counting…';
  try {
    const { encode } = await getTokenizer();
    const [a, b] = [before, after].map(text => encode(text, { disallowedSpecial: new Set() }).length);
    const delta = b - a;
    $('comparison').textContent = `${a} → ${b} tokens · ${delta > 0 ? '+' : ''}${delta} (${(100 * delta / a).toFixed(1)}%)`;
  } catch {
    $('comparison').textContent = 'Could not count tokens. Reload the page or use the local benchmark.';
  }
});

$('packet').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  try {
    const links = data.get('links').trim().split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    const packet = validateInput({ title: data.get('title'), content: data.get('content'), links });
    const blob = new Blob([`${JSON.stringify(packet, null, 2)}\n`], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const anchor = Object.assign(document.createElement('a'), { href, download: 'episode.json' });
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    $('packet-status').textContent = 'Source packet downloaded. Use it with the local Vlog command.';
  } catch (error) {
    $('packet-status').textContent = error.message;
  }
});
