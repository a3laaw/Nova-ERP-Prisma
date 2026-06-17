'use server';
import { getZAI, handleAIError } from '@/ai/zai-init';
export async function generateDelayReport(input: { projectTimelineData: string; currentDate: string }) {
  try {
    const zai = await getZAI();
    const response = await zai.chat.completions.create({
      messages: [{ role: 'user', content: `حلل بيانات المشروع وأنشئ تقرير تأخير بالعربية:\n${input.projectTimelineData}\nالتاريخ: ${input.currentDate}` }],
      thinking: { type: 'disabled' },
    });
    return { delayReport: response.choices?.[0]?.message?.content || '' };
  } catch (error: any) { throw handleAIError(error); }
}
