import { test } from 'node:test';
import assert from 'node:assert/strict';
import { replay, model, route, lightweight, usd, admit, rubric, episode, baseline, compressed, scoped } from '../src/lab.mjs';
import { encode } from 'gpt-tokenizer/encoding/o200k_base';

test('four disjoint cost buckets use per-million default-tier rates', () => {
  assert.equal(usd({ input: 1e6, cacheRead: 1e6, cacheWrite: 1e6, output: 1e6 }), 14.6);
  assert.throws(() => usd({ input: 1, output: 0 }), /invalid token buckets/);
});

test('script rubric rejects a missing fact, invalid turn order and line/word overages', () => {
  assert.equal(rubric(episode, 85, 4).pass, true);
  assert.equal(rubric(episode.replace('200', '300')).facts, false);
  assert.equal(rubric(episode.replace(/^Host:/, 'Guest:')).format, false);
  assert.equal(rubric(`${episode}\nHost: Bye.`, 85, 4).format, false);
  assert.equal(rubric(episode, 8).output, false);
});

test('compression and scoping reduce prompt-only counts independently', () => {
  assert.ok(encode(baseline).length > encode(compressed).length);
  assert.ok(encode(compressed).length > encode(scoped).length);
  assert.equal(replay(2)[0].usage.output, replay(2)[1].usage.output);
  assert.ok(replay(3)[1].usage.cacheRead > 0);
});

test('risk router promotes conflicting evidence and accepts only known routes', () => {
  assert.equal(route('routine'), lightweight);
  assert.equal(route('conflicting'), model);
  assert.throws(() => route('unknown'));
  assert.ok(replay(4)[1].cost < replay(4, 'conflicting')[1].cost);
});

test('budget and quality checks are fail-closed and allow the exact ceiling', () => {
  assert.equal(replay(5)[1].allowed, true);
  assert.equal(replay(5, 'conflicting', 0.0005)[1].allowed, false);
  assert.equal(admit({ quote: 1, spent: 1, ceiling: 2 }), true);
  assert.equal(admit({ quote: 0, spent: 0, ceiling: 2, checksPass: false }), false);
  assert.throws(() => admit({ quote: NaN, spent: 0, ceiling: 0 }));
});
