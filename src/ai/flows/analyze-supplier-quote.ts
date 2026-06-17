'use server';
import { getZAI, handleAIError } from '@/ai/zai-init';
export async function analyzeSupplierQuote(input: { quoteFileDataUri: string; rfqItems: { id: string; name: string }[] }) {
  try {
    const zai = await getZAI();
    const prompt = `تحليل عرض السعر. الأصناف: ${input.rfqItems.map(i => `- ${i.name}`).join('\n')}\nJSON: { "items": [{"rfqItemId":"","unitPrice":0}], "discountAmount":0, "deliveryFees":0, "deliveryTimeDays":0, "paymentTerms":"", "summary":"" }`;
    const response = await zai.chat.completions.createVision({
      model: 'glm-4.6v',
      messages: [{ role: 'user', content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: input.quoteFileDataUri } },
      ]}],
      thinking: { type: 'disabled' },
    });
    const text = response.choices?.[0]?.message?.content || '';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error: any) { throw handleAIError(error); }
}
