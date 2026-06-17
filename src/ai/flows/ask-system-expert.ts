'use server';
import { getZAI, handleAIError } from '@/ai/zai-init';
export async function askSystemExpert(input: { question: string; history?: Array<{ role: string; content: string }> }) {
  try {
    const zai = await getZAI();
    const messages: any[] = [{ role: 'system', content: 'أنت المساعد الذكي لنظام Nova ERP. أجب بالعربية باختصار.' }];
    if (input.history) for (const h of input.history) messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
    messages.push({ role: 'user', content: input.question });
    const response = await zai.chat.completions.create({ messages, thinking: { type: 'disabled' } });
    return { answer: response.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من معالجة سؤالك.' };
  } catch (error: any) { const e = handleAIError(error); return { answer: e.message }; }
}
