// OpenAI client — lazy require() on first call.
// Never import 'openai' at module scope: top-level imports trace the SDK
// into every route that imports this file, bloating the Lambda bundle.

type OpenAIInstance = import('openai').default;
type OpenAIClass = new (opts: { apiKey: string }) => OpenAIInstance;

let _OpenAIClass: OpenAIClass | null = null;
let client: OpenAIInstance | null = null;

function loadOpenAIClass(): OpenAIClass {
  if (!_OpenAIClass) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _OpenAIClass = (require('openai').default ?? require('openai')) as OpenAIClass;
  }
  return _OpenAIClass!;
}

export function getOpenAIClient(): OpenAIInstance {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'sk-Content-key' || apiKey === 'placeholder-build-key') {
    throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.');
  }
  if (!client) {
    const OpenAI = loadOpenAIClass();
    client = new OpenAI({ apiKey });
  }
  return client;
}

export function isOpenAIConfigured(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  return !!(apiKey && apiKey !== 'sk-Content-key' && apiKey !== 'placeholder-build-key');
}

export function getSafeOpenAIClient(): OpenAIInstance | null {
  try {
    return isOpenAIConfigured() ? getOpenAIClient() : null;
  } catch {
    return null;
  }
}
