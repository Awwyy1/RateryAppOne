import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { adminAuth, adminDb, FieldValue } from './_firebaseAdmin';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const FREE_SCANS_LIMIT = 1;
const PREMIUM_MONTHLY_LIMIT = 49;
const MIN_SCAN_INTERVAL_MS = 10_000; // 10 seconds between scans

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

  // --- AUTH: Verify Firebase ID token ---
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing auth token' });
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    uid = decodedToken.uid;
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  // --- FIRESTORE: Check plan & scan limits ---
  const userRef = adminDb.collection('users').doc(uid);
  const userDoc = await userRef.get();
  const userData = userDoc.exists ? userDoc.data() : null;

  const plan = userData?.plan || 'free';
  const totalScans = userData?.totalScans || 0;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  let scansThisMonth = userData?.scansThisMonth || 0;
  const monthReset = userData?.monthReset || '';

  // Reset monthly counter if new month
  if (monthReset !== currentMonth) {
    scansThisMonth = 0;
  }

  // Rate limiting: minimum interval between scans
  const lastScanAt = userData?.lastScanAt?.toMillis?.() || 0;
  if (Date.now() - lastScanAt < MIN_SCAN_INTERVAL_MS) {
    return res.status(429).json({ error: 'Too many requests. Please wait before scanning again.' });
  }

  // Check scan limits based on plan
  if (plan === 'free' && totalScans >= FREE_SCANS_LIMIT) {
    return res.status(403).json({ error: 'Free scan limit reached. Please upgrade your plan.' });
  }
  if (plan === 'premium' && scansThisMonth >= PREMIUM_MONTHLY_LIMIT) {
    return res.status(403).json({ error: 'Monthly scan limit reached. Upgrade to Pro for unlimited scans.' });
  }

  // --- ANALYZE: Process the image ---
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

CRITICAL SCORING GUIDELINES - READ CAREFULLY:
1. USE THE FULL SCORE RANGE: Scores should range from 25-95, NOT just 65-90
2. AVERAGE PERSON = 50-55, not 75. Most people should score 45-65.
3. Only exceptional individuals (models, celebrities, highly attractive people) should score 80+
4. BE REALISTIC AND DISCRIMINATING - users want honest assessment, not flattery

APPEARANCE FACTORS THAT MUST AFFECT SCORES:
- GROOMING: Hair condition, facial hair maintenance, skin care, overall cleanliness
- PRESENTATION: Clothing quality, style, appropriateness visible in frame
- HEALTH INDICATORS: Skin quality, eye clarity, signs of wellness or neglect
- SOCIAL STATUS SIGNALS: Overall polished vs unkempt appearance

METRICS HEAVILY AFFECTED BY APPEARANCE:
- Prestige: Unkempt/homeless appearance = 25-40, Average = 45-55, Well-groomed professional = 65-80
- Sophistication: Disheveled = 20-35, Average = 45-55, Refined/elegant = 70-85
- Stature: Poor presentation = 25-40, Average = 45-55, Commanding presence = 70-85
- Power: Weak/neglected appearance = 30-45, Average = 50-60, Strong/confident = 70-85
- Magnetism: Unappealing presentation = 25-40, Average = 45-55, Attractive/magnetic = 70-90

SCORING EXAMPLES:
- Homeless/unkempt person: Overall 3.5-5.0, most metrics 30-50
- Average everyday person: Overall 5.0-6.5, most metrics 45-60
- Attractive well-groomed person: Overall 6.5-8.0, most metrics 60-75
- Model/exceptional appearance: Overall 8.0-9.5, most metrics 75-90

If the image IS a valid human face photo, analyze it and respond with:
{
  "isValidFace": true,
  "overallScore": 6.2,
  "metrics": [
    {"label": "Trust", "value": 58, "benchmark": 50, "description": "Your relaxed eye contact and natural smile create an immediate sense of reliability."},
    {"label": "Magnetism", "value": 52, "benchmark": 50, "description": "Neutral presence - neither particularly drawing nor repelling attention."},
    {"label": "Spark", "value": 55, "benchmark": 50, "description": "Some distinctive features make you reasonably memorable."},
    {"label": "Warmth", "value": 60, "benchmark": 50, "description": "Approachable expression suggests friendliness."},
    {"label": "Power", "value": 48, "benchmark": 50, "description": "Average confidence projection, room for more assertive presence."},
    {"label": "Mystery", "value": 45, "benchmark": 50, "description": "Straightforward appearance, what you see is what you get."},
    {"label": "Sophistication", "value": 50, "benchmark": 50, "description": "Average refinement level for general population."},
    {"label": "Drive", "value": 55, "benchmark": 50, "description": "Some signs of determination visible in expression."},
    {"label": "Vibe", "value": 52, "benchmark": 50, "description": "Neutral energy, neither particularly positive nor negative."},
    {"label": "Prestige", "value": 48, "benchmark": 50, "description": "Average status signals, typical everyday presentation."},
    {"label": "Strictness", "value": 50, "benchmark": 50, "description": "Balanced between relaxed and disciplined appearance."},
    {"label": "Openness", "value": 58, "benchmark": 50, "description": "Receptive expression suggests willingness to engage."},
    {"label": "Pragmatism", "value": 52, "benchmark": 50, "description": "Grounded, practical appearance."},
    {"label": "Resilience", "value": 55, "benchmark": 50, "description": "Reasonable inner strength visible."},
    {"label": "Congruence", "value": 60, "benchmark": 50, "description": "Expression and features align authentically."},
    {"label": "Stature", "value": 50, "benchmark": 50, "description": "Average overall presence for general population."}
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
- Reference specific features: eyes, smile, jawline, expression, gaze, grooming, presentation
- Keep each description 10-20 words, insightful and personalized
- BE HONEST - if grooming is poor, mention it affects the score
- Avoid generic flattery - users want real feedback

Evaluate these 16 DNA metrics on a scale of 0-100:
1. Trust - How reliable and trustworthy does the person appear at first glance?
2. Magnetism - How much do they naturally draw attention and interest? (Factor in attractiveness)
3. Spark - How memorable and distinctive is their presence?
4. Warmth - How approachable and friendly do they seem?
5. Power - How much confidence and authority do they project? (Factor in presentation)
6. Mystery - How intriguing and interesting do they appear?
7. Sophistication - How refined and cultured do they appear? (Heavily factor grooming/style)
8. Drive - How ambitious and determined do they seem?
9. Vibe - What is their overall energy and aura?
10. Prestige - How high-status do they appear? (Heavily factor presentation/grooming)
11. Strictness - How disciplined and serious do they look?
12. Openness - How receptive and curious do they seem?
13. Pragmatism - How practical and grounded do they appear?
14. Resilience - How strong and enduring do they seem?
15. Congruence - How authentic and consistent do they appear?
16. Stature - What is their overall presence and standing? (Factor in overall appearance quality)

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

    // --- FIRESTORE: Update scan counts after successful analysis ---
    await userRef.set({
      plan,
      scansThisMonth: scansThisMonth + 1,
      monthReset: currentMonth,
      totalScans: totalScans + 1,
      lastScanAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
