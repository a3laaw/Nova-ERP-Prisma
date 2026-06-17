'use server';
import { getZAI, handleAIError } from '@/ai/zai-init';
export async function runAccountingAssistant(input: { command: string; currentDate: string }) {
  try {
    const zai = await getZAI();
    const response = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'أنت مساعد محاسبي في نظام ERP كويتي. حوّل الأوامر العربية إلى JSON فقط.' },
        { role: 'user', content: `التاريخ: ${input.currentDate}\nالأمر: ${input.command}` },
      ],
      thinking: { type: 'disabled' },
    });
    const text = response.choices?.[0]?.message?.content || '';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error: any) { throw handleAIError(error); }
}
