import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

const ROOT = process.cwd();
const PUBLIC_LLM_PATH = path.join(ROOT, 'dist', 'llms.txt');
const TEMPORARY_CONTEXT_PATH = path.join(ROOT, 'dist', 'chat-context.txt');
const PRIVATE_CONTEXT_MODULE_PATH = path.join(ROOT, 'netlify', 'functions', '_generated', 'portfolio-chat-context.ts');
const MAX_PUBLIC_LLM_BYTES = 15_000;

const PublicLlmsSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_PUBLIC_LLM_BYTES)
  .refine(value => value.startsWith('# Aaron Molina\n'), 'llms.txt must start with the site H1.')
  .refine(value => value.includes('\n> '), 'llms.txt must include a short blockquote summary.')
  .refine(value => value.includes('\n## Projects\n'), 'llms.txt must include a Projects link list.')
  .refine(value => !value.includes('\n### '), 'llms.txt must remain a concise directory without nested content sections.');

const PrivateContextModuleSchema = z
  .string()
  .min(1)
  .refine(value => value.includes('PORTFOLIO_CHAT_CONTEXT'), 'Private chat context export is missing.')
  .refine(value => value.includes('FireAid'), 'Private chat context is missing authored project details.');

async function main() {
  const [publicLlms, privateContextModule, temporaryContextExists] = await Promise.all([
    fs.readFile(PUBLIC_LLM_PATH, 'utf8'),
    fs.readFile(PRIVATE_CONTEXT_MODULE_PATH, 'utf8'),
    fs
      .access(TEMPORARY_CONTEXT_PATH)
      .then(() => true)
      .catch(() => false),
  ]);

  PublicLlmsSchema.parse(publicLlms);
  PrivateContextModuleSchema.parse(privateContextModule);

  if (temporaryContextExists) {
    throw new Error('The build-only chat-context.txt file must not be included in the public dist directory.');
  }

  console.log(`Verified public llms.txt (${Buffer.byteLength(publicLlms)} bytes) and private generated chat context.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
