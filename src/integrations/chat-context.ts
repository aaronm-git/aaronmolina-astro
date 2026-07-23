import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { z } from 'zod';

const ChatContextSchema = z.string().trim().min(1);
const generatedModuleUrl = new URL('../../netlify/functions/_generated/portfolio-chat-context.ts', import.meta.url);

/**
 * Embeds the build-only full portfolio context in the chat function bundle and
 * removes the temporary static file so it is never deployed as a public URL.
 */
export function chatContext(): AstroIntegration {
  return {
    name: 'portfolio-chat-context',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const contextOutputUrl = new URL('chat-context.txt', dir);
        const context = ChatContextSchema.parse(await readFile(contextOutputUrl, 'utf8'));
        const version = createHash('sha256').update(context).digest('hex').slice(0, 16);
        const moduleSource = `/** This file is generated during the Astro build. Do not edit it manually. */\nexport const PORTFOLIO_CHAT_CONTEXT = ${JSON.stringify(context)};\nexport const PORTFOLIO_CHAT_CONTEXT_VERSION = '${version}';\n`;

        await mkdir(fileURLToPath(new URL('.', generatedModuleUrl)), { recursive: true });
        await writeFile(generatedModuleUrl, moduleSource, 'utf8');
        await rm(contextOutputUrl, { force: true });
      },
    },
  };
}
