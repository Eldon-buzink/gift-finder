import { openai } from '@/lib/openai';

export async function getGiftSuggestions(reply: string, occasion: string) {
  const prompt = `
Give me 3 short, fun gift suggestions for the reply: "${reply}", for a "${occasion}" occasion. 
Include a mix of creative, low-cost or free ideas and 1 or 2 product links if relevant.
Respond as a JSON array of 3 objects with "label" (string), and optional "url" (string).
Do not include any code blocks. Respond with ONLY valid JSON.
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 250,
  });

  try {
    let content = res.choices[0].message.content || '[]';

    // Strip markdown code block if present
    if (content.startsWith("```json")) {
      content = content.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    } else if (content.startsWith("```")) {
      content = content.replace(/^```\s*/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(content);
    console.log("Parsed suggestions:", parsed);
    return parsed;
  } catch (error) {
    console.error('Gift suggestion parsing failed:', error);
    return [
      { label: '🕯️ Candles' },
      { label: '🍷 Wine' },
      { label: '🧱 Lego' }
    ];
  }
} 