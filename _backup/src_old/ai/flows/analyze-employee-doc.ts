'use server';
import { getZAI, handleAIError } from '@/ai/zai-init';
export async function analyzeEmployeeDocument(input: { fileDataUri: string }) {
  try {
    const zai = await getZAI();
    const prompt = `حلل الصورة واستخرج JSON: { "fullName", "nameEn", "civilId", "nationality", "dob", "residencyExpiry", "gender", "summary" }`;
    const response = await zai.chat.completions.createVision({
      model: 'glm-4.6v',
      messages: [{ role: 'user', content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: input.fileDataUri } },
      ]}],
      thinking: { type: 'disabled' },
    });
    const text = response.choices?.[0]?.message?.content || '';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error: any) { throw handleAIError(error); }
}
