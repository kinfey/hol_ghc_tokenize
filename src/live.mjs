import { CopilotClient } from '@github/copilot-sdk';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export async function withCopilot(work) {
  const cwd = await mkdtemp(join(tmpdir(), 'podcast-lab-'));
  const client = new CopilotClient({ workingDirectory: cwd });
  const sessions = new Map();
  try {
    await client.start();
    if (!(await client.getAuthStatus()).isAuthenticated) {
      throw new Error('Authenticate GitHub Copilot CLI interactively before using --live.');
    }
    const models = await client.listModels();
    return await work(async ({ prompt, modelId, sessionKey = Symbol(), effort = 'low' }) => {
      const spec = models.find(({ id }) => id === modelId);
      if (!spec) throw new Error(`Model ${modelId} is not available for this account; no fallback was used.`);
      let session = sessions.get(sessionKey);
      if (!session) {
        session = await client.createSession({
          model: modelId,
          ...(spec.supportedReasoningEfforts?.includes(effort) ? { reasoningEffort: effort } : {}),
          workingDirectory: cwd,
          availableTools: [],
          mcpServers: {},
          infiniteSessions: { enabled: false },
          onPermissionRequest: async () => ({ kind: 'denied-interactively-by-user' }),
        });
        sessions.set(sessionKey, session);
      }
      const events = [];
      const off = session.on('assistant.usage', ({ data }) => {
        const { model, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens, duration,
          finishReason, aiCreditsStatus, copilotUsage } = data;
        events.push({ model, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens,
          reasoningTokens, duration, finishReason, aiCreditsStatus, copilotUsage });
      });
      const start = performance.now();
      try {
        const response = await session.sendAndWait({ prompt }, 90_000);
        const text = response?.data.content?.trim();
        if (!text) throw new Error('Copilot returned no dialogue.');
        return { text, events, model: modelId, latencyMs: Math.round(performance.now() - start) };
      } finally {
        off();
      }
    });
  } finally {
    try { await client.stop(); } finally { await rm(cwd, { force: true, recursive: true }); }
  }
}
