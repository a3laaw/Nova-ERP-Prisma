'use server';
import { getZAI, handleAIError } from '@/ai/zai-init';
import { z } from 'zod';
const ReconciliationInputSchema = z.object({
  bankTransactions: z.array(z.object({ id: z.string(), date: z.string(), description: z.string(), amount: z.number() })),
  systemTransactions: z.array(z.object({ id: z.string(), date: z.string(), description: z.string(), amount: z.number() })),
});
const ReconciliationOutputSchema = z.object({
  matchedPairs: z.array(z.object({ bankTransactionId: z.string(), systemTransactionId: z.string(), confidence: z.number() })),
  unmatchedBankIds: z.array(z.string()),
  unmatchedSystemIds: z.array(z.string()),
  explanation: z.string(),
});
export type ReconciliationInput = z.infer<typeof ReconciliationInputSchema>;
export type ReconciliationOutput = z.infer<typeof ReconciliationOutputSchema>;
export async function reconcileBankStatement(input: ReconciliationInput): Promise<ReconciliationOutput> {
  try {
    const zai = await getZAI();
    const systemPrompt = `You are a financial auditor AI. Match bank transactions with system transactions. Criteria: 1. Amount (exact match), 2. Date (within 3 days), 3. Description (keywords). Confidence: 1.0=perfect, 0.8-0.9=close dates, 0.6-0.7=larger diff, <0.6=no match. Output JSON only.`;
    const response = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Bank: ${JSON.stringify(input.bankTransactions)}\nSystem: ${JSON.stringify(input.systemTransactions)}` },
      ],
      thinking: { type: 'disabled' },
    });
    const text = response.choices?.[0]?.message?.content || '';
    return ReconciliationOutputSchema.parse(JSON.parse(text.replace(/```json|```/g, '').trim()));
  } catch (error: any) { throw handleAIError(error); }
}
