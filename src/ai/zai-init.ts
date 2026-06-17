import ZAI from 'z-ai-web-dev-sdk';
let zaiInstance: ZAI | null = null;
export async function getZAI(): Promise<ZAI> {
  if (zaiInstance) return zaiInstance;
  zaiInstance = await ZAI.create();
  return zaiInstance;
}
export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }
export function handleAIError(error: any): Error {
  const msg = error?.message || String(error);
  if (msg.includes('429') || msg.includes('quota') || msg.includes('Resource has been exhausted'))
    return new Error('خادم الذكاء الاصطناعي مشغول حالياً. يرجى المحاولة مرة أخرى خلال دقائق.');
  if (msg.includes('network') || msg.includes('ECONNREFUSED') || msg.includes('fetch failed'))
    return new Error('خطأ في الاتصال بخادم الذكاء الاصطناعي. تحقق من الإنترنت.');
  return new Error(msg);
}
