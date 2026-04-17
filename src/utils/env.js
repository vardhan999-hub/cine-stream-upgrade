// ─── src/utils/env.js ────────────────────────────────────────────────────
// Validates all required environment variables at app startup using Zod.
// This fails loudly in development (with a clear message) rather than
// failing silently at runtime when an API call eventually fires.
//
// Usage: import { env } from './utils/env';
//        const key = env.VITE_TMDB_API_KEY;

import { z } from 'zod';

const envSchema = z.object({
  // Required — app won't work without this
  VITE_TMDB_API_KEY: z
    .string()
    .min(1, 'VITE_TMDB_API_KEY is missing')
    .refine((v) => v !== 'your_tmdb_api_key_here', {
      message: 'VITE_TMDB_API_KEY is still set to the placeholder value',
    }),

  // Optional — Mood Matcher feature degrades gracefully without it
  VITE_GROQ_API_KEY: z
    .string()
    .optional()
    .refine((v) => v !== 'your_groq_api_key_here', {
      message: 'VITE_GROQ_API_KEY is still set to the placeholder value',
    }),
});

// Vite exposes env vars on import.meta.env
const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  // Format Zod errors into a readable list
  const messages = parsed.error.errors.map((e) => `  • ${e.path.join('.')}: ${e.message}`);
  console.error(
    `\n🚨 Environment validation failed:\n${messages.join('\n')}\n\n` +
      `Copy .env.example to .env and fill in your API keys.\n`,
  );
  // In development, throw so the error is impossible to miss
  if (import.meta.env.DEV) {
    throw new Error('Invalid environment variables. Check the console for details.');
  }
}

// Export the validated + typed env object
// Falls back to empty strings in production if validation was skipped
export const env = parsed.success
  ? parsed.data
  : { VITE_TMDB_API_KEY: '', VITE_GROQ_API_KEY: undefined };
