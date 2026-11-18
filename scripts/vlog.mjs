#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, open, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  buildPrompt, composition, fixtureDialogue, FPS, HYPERFRAMES_PACKAGE, MAX_INPUT_BYTES, MAX_SCRIPT_BYTES, MODEL,
  parseDialogue, planScenes, validateInput,
} from '../src/vlog.mjs';

const help = `Usage: npm run vlog -- --input examples/garden.json [--live | --script path] [--render]

Input JSON: {"title":"…","content":"Paste the source excerpts here.","links":["https://…"]}
Links are references only and are never fetched. Do not send private content with --live.
Default: replay the bundled garden dialogue. --live uses Copilot SDK (${MODEL}).
--script reads exactly four alternating Host:/Guest: lines from an App-generated or edited UTF-8 text file.
--render uses macOS say (Samantha and Daniel), FFmpeg/ffprobe, and ${HYPERFRAMES_PACKAGE}.
HyperFrames may download packages or browser binaries on first use; no source URLs are loaded.
Outputs: reports/vlog/{fixture,live,script}/episode.json and, with --render, an episode.mp4 and editable project/ folder.`;

async function loadText(path, limit, label) {
  const file = await open(path, 'r');
  try {
    const info = await file.stat();
    if (!info.isFile() || info.size > limit) throw new Error(`${label} must be a file of up to ${limit} bytes.`);
    const buffer = Buffer.alloc(limit + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await file.read(buffer, length, buffer.length - length);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > limit) throw new Error(`${label} exceeds ${limit} bytes.`);
    try { return new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, length)); }
    catch { throw new Error(`${label} must be valid UTF-8.`); }
  } finally {
    await file.close();
  }
}

function command(program, args, options = {}) {
  try {
    return execFileSync(program, args, { encoding: 'utf8', ...options });
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`Required program not found: ${program}`);
    const details = error.stderr?.trim();
    throw new Error(`${program} failed (${error.status ?? error.signal ?? error.code ?? 'unknown error'})${details ? `: ${details}` : '.'}`);
  }
}

function renderPrerequisites() {
  if (process.platform !== 'darwin') throw new Error('--render requires macOS say. Script generation does not require macOS.');
  const voices = command('say', ['-v', '?']);
  if (!['Samantha', 'Daniel'].every(name => new RegExp(`^${name}\\s`, 'm').test(voices))) {
    throw new Error('Enable the Samantha and Daniel voices in macOS System Settings before rendering.');
  }
  for (const program of ['ffmpeg', 'ffprobe']) command(program, ['-version']);
}

function mediaInfo(path) {
  return JSON.parse(command('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height',
    '-of', 'json', path,
  ]));
}

async function render(input, turns, directory) {
  const staging = join(directory, `render-${randomUUID()}`);
  await mkdir(staging);
  try {
    const project = join(staging, 'project');
    const runtime = join(staging, 'runtime');
    await Promise.all([mkdir(project), mkdir(runtime)]);
    const env = { ...process.env, TMPDIR: runtime, TMP: runtime, TEMP: runtime };
    const durations = turns.map(({ speaker, text }, index) => {
      const stem = `turn-${index + 1}`;
      const aiff = join(staging, `${stem}.aiff`);
      const wav = join(project, `${stem}.wav`);
      command('say', ['-v', speaker === 'Host' ? 'Samantha' : 'Daniel', '-r', '155', '-o', aiff, '-f', '-'],
        { env, input: `${text}\n` });
      command('ffmpeg', ['-v', 'error', '-nostdin', '-i', aiff, '-ar', '48000', '-ac', '1', wav], { env });
      return Number(mediaInfo(wav).format.duration);
    });
    const timeline = planScenes(turns, durations);
    await writeFile(join(project, 'index.html'), composition(input, timeline, { audio: true }));
    const mp4 = join(staging, 'episode.mp4');
    command('npm', [
      'exec', '--yes', '--package', HYPERFRAMES_PACKAGE, '--', 'hyperframes', 'render',
      project, '--output', mp4, '--fps', String(FPS), '--workers', '2', '--strict',
    ], { env, stdio: 'inherit' });
    const info = mediaInfo(mp4);
    const duration = Number(info.format?.duration);
    if (!info.streams?.some(stream => stream.codec_type === 'video' && stream.codec_name === 'h264'
      && stream.width === 1280 && stream.height === 720)
      || !info.streams.some(stream => stream.codec_type === 'audio' && stream.codec_name === 'aac')
      || !Number.isFinite(duration) || Math.abs(duration - timeline.totalFrames / FPS) > 2 / FPS) {
      throw new Error('Rendered MP4 failed ffprobe verification (1280×720 H.264, AAC, and expected duration required).');
    }
    await rm(join(directory, 'project'), { recursive: true, force: true });
    await rename(project, join(directory, 'project'));
    await rename(mp4, join(directory, 'episode.mp4'));
    return timeline;
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string' }, live: { type: 'boolean' }, script: { type: 'string' },
      render: { type: 'boolean' }, help: { type: 'boolean', short: 'h' },
    },
  });
  if (values.help) return console.log(help);
  if (!values.input) throw new Error('Missing --input. See --help for usage.');
  if (values.live && values.script !== undefined) throw new Error('--live and --script are mutually exclusive.');
  if (values.script === '') throw new Error('--script needs a path to a UTF-8 text file.');
  const raw = await loadText(values.input, MAX_INPUT_BYTES, 'Input JSON');
  let json;
  try { json = JSON.parse(raw); } catch { throw new Error('Input must be valid JSON.'); }
  const input = validateInput(json);
  if (values.render) renderPrerequisites();
  const mode = values.live ? 'live' : values.script ? 'script' : 'fixture';
  let text;
  let metadata = {};
  if (values.live) {
    const { withCopilot } = await import('../src/live.mjs');
    const response = await withCopilot(run => run({
      prompt: buildPrompt(input), modelId: MODEL, sessionKey: 'vlog', effort: 'low',
    }));
    text = response.text;
    metadata = { model: response.model, latencyMs: response.latencyMs };
  } else if (values.script) {
    text = await loadText(values.script, MAX_SCRIPT_BYTES, 'Screenplay');
  } else {
    text = fixtureDialogue(input);
  }
  const turns = parseDialogue(text);
  const directory = resolve('reports', 'vlog', mode);
  await mkdir(directory, { recursive: true });
  const timeline = values.render ? await render(input, turns, directory) : planScenes(turns);
  const report = join(directory, 'episode.json');
  await writeFile(report, `${JSON.stringify({
    mode, ...metadata, title: input.title, links: input.links,
    dialogue: turns.map(({ speaker, text }) => `${speaker}: ${text}`).join('\n'), ...timeline,
  }, null, 2)}\n`);
  console.log(`Podcast script and timeline: ${report}`);
  if (values.render) console.log(`Verified MP4: ${join(directory, 'episode.mp4')}`);
}

main().catch(error => {
  console.error(`Vlog: ${error.message}`);
  process.exitCode = 1;
});
