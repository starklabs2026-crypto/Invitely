import { openai } from './clients';
import { BUNDLED_FONTS } from '../config';
import { AnalysisResultSchema, type AnalysisResult } from '../types';

const SYSTEM_PROMPT = `
You are an expert invitation card designer analyzing a background image.
This image is the background for a 9:16 portrait digital invitation card (canvas ~390×844 px).

Your job:
1. Identify 5–9 natural text areas that respect the visual composition (empty regions, decorative frames, clear spaces).
2. For each zone pick the most fitting font from the AVAILABLE FONTS list — choose based on the aesthetic (formal, playful, romantic, etc.).
3. Choose text colors that are legible against the background, preferring colors already present in the palette.
4. Suggest subtle effects (shadow or stroke) where they would help text blend naturally — do not over-effect.
5. Estimate font sizes as if the canvas were 390 px wide. Headline ~28–48, sub-heading ~16–24, body ~11–14.

AVAILABLE FONTS (use the exact string as fontFamily):
${BUNDLED_FONTS.join(', ')}

ZONE ID VOCABULARY (pick from these): tagline, title, name, subtitle, occasion, date, time, venue, rsvp, footer

Return ONLY a valid JSON object — no markdown, no explanation:
{
  "overall_confidence": 0.0–1.0,
  "has_baked_text": true/false,
  "background_description": "short description of the background",
  "zones": [
    {
      "id": "title",
      "label": "Title",
      "defaultText": "example text for this zone",
      "leftPct": 0–100,
      "topPct": 0–100,
      "widthPct": 1–100,
      "heightPct": 1–100,
      "fontFamily": "<exact font name from list above>",
      "fontSize": 8–120,
      "color": "#RRGGBB or rgba(...)",
      "align": "left|center|right",
      "bold": true/false,
      "italic": true/false,
      "effects": {
        "shadow": { "offsetX": 1, "offsetY": 1, "blur": 3, "color": "rgba(0,0,0,0.4)" }
      },
      "confidence": 0.0–1.0
    }
  ]
}
`.trim();

export async function analyzeTemplate(
  imageUrl: string,
  templateId: string
): Promise<AnalysisResult> {
  console.log(`  → Sending ${templateId} to GPT-4o Vision...`);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    max_tokens: 3000,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'high' },
          },
          {
            type: 'text',
            text: `Analyze this invitation card background (template id: ${templateId}). Return only the JSON object described in the system prompt.`,
          },
        ],
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? '';

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`GPT-4o returned non-JSON response:\n${raw}`);
  }

  const result = AnalysisResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`GPT-4o response failed validation:\n${JSON.stringify(result.error.flatten(), null, 2)}\n\nRaw:\n${raw}`);
  }

  console.log(`  ✓ Got ${result.data.zones.length} zones (confidence: ${result.data.overall_confidence.toFixed(2)})`);
  return result.data;
}
