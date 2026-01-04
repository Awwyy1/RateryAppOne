import type { VercelRequest, VercelResponse } from '@vercel/node';

// Creem.io API configuration
const CREEM_API_KEY = process.env.CREEM_API_KEY;
const CREEM_PRODUCT_ID = process.env.CREEM_PRODUCT_ID;
const CREEM_API_URL = 'https://api.creem.io/v1/checkouts';

// Get the base URL for redirects
const getBaseUrl = (req: VercelRequest): string => {
  // Check for custom domain first
  const host = req.headers.host;
  if (host?.includes('ratery.cc')) {
    return 'https://ratery.cc';
  }
  // Use VERCEL_URL environment variable
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;
  }
  // Fallback
  return 'https://ratery.cc';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!CREEM_API_KEY || !CREEM_PRODUCT_ID) {
    console.error('Missing Creem.io configuration:', {
      hasApiKey: !!CREEM_API_KEY,
      hasProductId: !!CREEM_PRODUCT_ID
    });
    return res.status(500).json({
      error: 'Payment service not configured',
      details: 'Missing API credentials'
    });
  }

  try {
    const baseUrl = getBaseUrl(req);

    const requestBody = {
      product_id: CREEM_PRODUCT_ID,
      success_url: `${baseUrl}/?payment=success`,
      cancel_url: `${baseUrl}/?payment=cancelled`,
    };

    console.log('Creating checkout with:', {
      url: CREEM_API_URL,
      productId: CREEM_PRODUCT_ID,
      baseUrl
    });

    // Create checkout session with Creem
    const response = await fetch(CREEM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CREEM_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log('Creem API response status:', response.status);
    console.log('Creem API response:', responseText);

    if (!response.ok) {
      console.error('Creem API error:', responseText);
      return res.status(500).json({
        error: 'Failed to create checkout session',
        details: responseText
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Creem response:', responseText);
      return res.status(500).json({
        error: 'Invalid response from payment service'
      });
    }

    // Return the checkout URL
    return res.status(200).json({
      checkout_url: data.checkout_url || data.url,
      session_id: data.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
