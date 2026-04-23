/**
 * lib/groq-client.ts
 *
 * Groq inference client — drop-in replacement for OpenAI in content generation.
 * Free tier: 14,400 req/day, no credit card required.
 * Model: llama-3.3-70b-versatile — same quality as GPT-4o for structured content.
 */

import Groq from 'groq-sdk';

let _client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!_client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not set');
    _client = new Groq({ apiKey });
  }
  return _client;
}

export function isGroqConfigured(): boolean {
  return !!process.env.GROQ_API_KEY;
}

/**
 * Generate structured JSON content via Groq.
 * Uses llama-3.3-70b-versatile — fast, free, high quality.
 */
export async function groqJSON<T = unknown>(prompt: string): Promise<T> {
  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    model:       'llama-3.3-70b-versatile',
    messages:    [
      {
        role:    'system',
        content: 'You are a professional curriculum architect. Always respond with valid JSON only. No markdown, no prose, no code fences.',
      },
      { role: 'user', content: prompt },
    ],
    temperature:      0.4,
    max_tokens:       2048,
    response_format:  { type: 'json_object' },
  });
  const raw = completion.choices[0]?.message?.content ?? '{}';
  return JSON.parse(raw) as T;
}
