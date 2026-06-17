'use server';
import { getZAI, handleAIError } from '@/ai/zai-init';
export async function suggestTaskPrioritization(input: { projectTimeline: string; dependencies: string; resourceAvailability: string }) {
  try {
    const zai = await getZAI();
    const response = await zai.chat.completions.create({
      messages: [{ role: 'user', content: `رتّب أولويات المهام بالعربية:\nالجدول: ${input.projectTimeline}\nالاعتمادات: ${input.dependencies}\nالموارد: ${input.resourceAvailability}` }],
      thinking: { type: 'disabled' },
    });
    return { prioritizedTasks: response.choices?.[0]?.message?.content || '' };
  } catch (error: any) { throw handleAIError(error); }
}
