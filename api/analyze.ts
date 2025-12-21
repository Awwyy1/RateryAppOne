import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    // Get the Gemini model with vision capabilities
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt for facial analysis
    const prompt = `You are a professional first-impression and social perception analyst. Analyze this facial photo and provide a detailed perception audit.

IMPORTANT: Respond ONLY with valid JSON, no markdown formatting, no code blocks, just raw JSON.

Evaluate the following metrics on a scale of 0-100:
1. Trustworthiness - How reliable and honest does the person appear?
2. Charisma - What is their magnetic/attractive presence level?
3. Intelligence - How intellectually capable do they appear?
4. Approachability - How easy would it be to start a conversation with them?
5. Authority - How commanding is their leadership presence?
6. Energy - What is their perceived vitality and engagement level?

Also provide:
- An overall impact score (0-10 with one decimal)
- 3 specific, actionable insights about their appearance that could help improve first impressions

Respond in this exact JSON format:
{
  "overallScore": 8.2,
  "metrics": [
    {"label": "Trustworthiness", "value": 85, "benchmark": 72, "description": "Brief explanation of score"},
    {"label": "Charisma", "value": 78, "benchmark": 65, "description": "Brief explanation"},
    {"label": "Intelligence", "value": 90, "benchmark": 78, "description": "Brief explanation"},
    {"label": "Approachability", "value": 65, "benchmark": 70, "description": "Brief explanation"},
    {"label": "Authority", "value": 82, "benchmark": 68, "description": "Brief explanation"},
    {"label": "Energy", "value": 75, "benchmark": 60, "description": "Brief explanation"}
  ],
  "insights": [
    "Specific insight about their appearance",
    "Another actionable suggestion",
    "Third observation or recommendation"
  ]
}

Base benchmarks on average population scores. Be objective but constructive in your analysis.`;

    // Generate content with the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      // Clean the response - remove any potential markdown formatting
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      // Return a fallback result if parsing fails
      analysisResult = {
        overallScore: 7.5,
        metrics: [
          { label: 'Trustworthiness', value: 75, benchmark: 72, description: 'Analysis pending - please try again.' },
          { label: 'Charisma', value: 70, benchmark: 65, description: 'Analysis pending - please try again.' },
          { label: 'Intelligence', value: 80, benchmark: 78, description: 'Analysis pending - please try again.' },
          { label: 'Approachability', value: 68, benchmark: 70, description: 'Analysis pending - please try again.' },
          { label: 'Authority', value: 72, benchmark: 68, description: 'Analysis pending - please try again.' },
          { label: 'Energy', value: 70, benchmark: 60, description: 'Analysis pending - please try again.' }
        ],
        insights: [
          'Unable to fully process the image. Please try with a clearer headshot.',
          'Ensure good lighting and a neutral background for best results.',
          'Front-facing photos with visible facial features work best.'
        ]
      };
    }

    // Validate and sanitize the response
    if (!analysisResult.overallScore || !analysisResult.metrics || !analysisResult.insights) {
      throw new Error('Invalid response structure');
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
