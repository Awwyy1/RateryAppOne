import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface MetricData {
  label: string;
  value: number;
  benchmark: number;
  description: string;
}

interface AnalysisResult {
  overallScore: number;
  metrics: MetricData[];
  insights: string[];
  isValidFace?: boolean;
  validationMessage?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Extract base64 data and media type from data URL
    const matches = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const mediaType = matches[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    const base64Data = matches[2];

    // Create the prompt for facial analysis with validation
    const prompt = `You are a professional first-impression and social perception analyst. Your task is to analyze facial photos of REAL HUMAN FACES ONLY.

IMPORTANT VALIDATION STEP:
First, determine if this image contains a clear, real human face suitable for perception analysis.

REJECT the image if:
- It's a landscape, object, animal, or non-human subject
- It's a cartoon, anime, illustration, or AI-generated character
- It's a robot, mask, or artificial face
- The face is too blurry, too small, or not visible
- It's a group photo without a clear primary subject
- It's a meme, screenshot, or non-portrait image

If the image is NOT a valid human face photo, respond with EXACTLY this JSON:
{
  "isValidFace": false,
  "validationMessage": "[Explain why this image cannot be analyzed - e.g., 'This appears to be a landscape photo' or 'No human face detected']"
}

If the image IS a valid human face photo, analyze it and respond with:
{
  "isValidFace": true,
  "overallScore": 8.2,
  "metrics": [
    {"label": "Trust", "value": 85, "benchmark": 72, "description": "Your relaxed eye contact and natural smile create an immediate sense of reliability."},
    {"label": "Magnetism", "value": 78, "benchmark": 65, "description": "Strong facial symmetry and engaging expression naturally draw people's attention."},
    {"label": "Spark", "value": 90, "benchmark": 78, "description": "Unique combination of intensity in your gaze and warmth makes you highly memorable."},
    {"label": "Warmth", "value": 65, "benchmark": 70, "description": "Subtle tension in your expression slightly reduces perceived approachability."},
    {"label": "Power", "value": 82, "benchmark": 68, "description": "Defined jawline and direct gaze project strong confidence and authority."},
    {"label": "Mystery", "value": 75, "benchmark": 60, "description": "Depth in your eyes and composed expression create an intriguing presence."},
    {"label": "Sophistication", "value": 79, "benchmark": 65, "description": "Refined features and poised demeanor suggest cultural awareness and taste."},
    {"label": "Drive", "value": 85, "benchmark": 70, "description": "Focused gaze and forward-leaning energy convey strong ambition and determination."},
    {"label": "Vibe", "value": 77, "benchmark": 68, "description": "Overall energy feels grounded yet dynamic, creating positive first impressions."},
    {"label": "Prestige", "value": 73, "benchmark": 62, "description": "Your presentation and composure signal someone of notable standing."},
    {"label": "Strictness", "value": 68, "benchmark": 55, "description": "Structured expression indicates discipline without appearing rigid."},
    {"label": "Openness", "value": 81, "benchmark": 72, "description": "Relaxed brow and attentive eyes show genuine curiosity and receptiveness."},
    {"label": "Pragmatism", "value": 74, "benchmark": 65, "description": "Grounded expression suggests practical, no-nonsense approach to life."},
    {"label": "Resilience", "value": 86, "benchmark": 70, "description": "Strong facial structure and calm demeanor project inner strength."},
    {"label": "Congruence", "value": 82, "benchmark": 75, "description": "Expression and features align naturally, suggesting authenticity."},
    {"label": "Stature", "value": 78, "benchmark": 68, "description": "Overall presence commands attention and respect in social settings."}
  ],
  "insights": [
    "Specific insight about their appearance",
    "Another actionable suggestion",
    "Third observation or recommendation"
  ]
}

IMPORTANT FOR DESCRIPTIONS:
- Each description must be UNIQUE and SPECIFIC to this person's actual facial features
- Explain WHY they received that score based on what you observe
- Reference specific features: eyes, smile, jawline, expression, gaze, etc.
- Keep each description 10-20 words, insightful and personalized
- Avoid generic phrases - make it feel like a personal reading

Evaluate these 16 DNA metrics on a scale of 0-100:
1. Trust - How reliable and trustworthy does the person appear at first glance?
2. Magnetism - How much do they naturally draw attention and interest?
3. Spark - How memorable and distinctive is their presence?
4. Warmth - How approachable and friendly do they seem?
5. Power - How much confidence and authority do they project?
6. Mystery - How intriguing and interesting do they appear?
7. Sophistication - How refined and cultured do they appear?
8. Drive - How ambitious and determined do they seem?
9. Vibe - What is their overall energy and aura?
10. Prestige - How high-status do they appear?
11. Strictness - How disciplined and serious do they look?
12. Openness - How receptive and curious do they seem?
13. Pragmatism - How practical and grounded do they appear?
14. Resilience - How strong and enduring do they seem?
15. Congruence - How authentic and consistent do they appear?
16. Stature - What is their overall presence and standing?

RESPOND ONLY WITH VALID JSON, no markdown, no code blocks.`;

    // Call Claude API with vision
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    const text = textContent.text;

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      // Clean the response - remove any potential markdown formatting
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', text);
      return res.status(400).json({
        isValidFace: false,
        validationMessage: 'Unable to process the image. Please try with a clearer headshot.'
      });
    }

    // Check if it's a valid face
    if (analysisResult.isValidFace === false) {
      return res.status(400).json({
        isValidFace: false,
        validationMessage: analysisResult.validationMessage || 'No valid human face detected in the image.'
      });
    }

    // Validate the analysis response structure
    if (!analysisResult.overallScore || !analysisResult.metrics || !analysisResult.insights) {
      return res.status(400).json({
        isValidFace: false,
        validationMessage: 'Unable to complete facial analysis. Please try with a different photo.'
      });
    }

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
