import type { VercelRequest, VercelResponse } from '@vercel/node';

// Creem.io API configuration
const CREEM_API_KEY = process.env.CREEM_API_KEY || 'creem_test_4S2uqJBNUDsReRlnI43VHY';
const CREEM_PRODUCT_ID = process.env.CREEM_PRODUCT_ID || 'prod_vyB0YRaHxUbaw15RrwYWs';
const CREEM_API_URL = 'https://api.creem.io/v1/checkouts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create checkout session with Creem
    const response = await fetch(CREEM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CREEM_API_KEY,
      },
      body: JSON.stringify({
        product_id: CREEM_PRODUCT_ID,
        success_url: `${process.env.VERCEL_URL || 'https://ratery.cc'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.VERCEL_URL || 'https://ratery.cc'}/cabinet`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Creem API error:', errorData);
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }

    const data = await response.json();

    // Return the checkout URL
    return res.status(200).json({
      checkout_url: data.checkout_url,
      session_id: data.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
