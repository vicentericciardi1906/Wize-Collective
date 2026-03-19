// ============================================================
// WIZE COLLECTIVE — Stripe Payment Intent API
// Vercel Serverless Function
// File: /api/create-payment-intent.js
// ============================================================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Retreat prices in cents (Stripe uses smallest currency unit)
const PRICES = {
  'Seeds to Bloom':              89000,   // €890.00
  'Amazónes Retreat':           140000,   // €1,400.00
  'Flux — April':                 4500,   // €45.00
  'Flux — May':                   4500,
  'Flux — June':                  4500,
  'Wize Days':                    3500,   // €35.00
  'Wize Day — Summer':            3500,
  'Holistic Coaching Session':   12000,   // €120.00
  'Dynamic Breathwork':           5500,   // €55.00
};

module.exports = async function handler(req, res) {
  // CORS headers
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { retreat, email, name, date } = req.body;

    // Validate required fields
    if (!retreat || !email || !name) {
      return res.status(400).json({
        error: 'Missing required fields: retreat, email, name',
      });
    }

    // Look up price
    const amount = PRICES[retreat];
    if (!amount) {
      return res.status(400).json({
        error: `Unknown retreat: "${retreat}". Please contact us directly.`,
      });
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        retreat,
        date:         date || 'TBC',
        client_name:  name,
        client_email: email,
        source:       'wize-collective-website',
      },
      receipt_email: email,
      description: `Wize Collective — ${retreat}${date ? ' · ' + date : ''}`,
    });

    // Return client secret to frontend
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount,
      currency: 'eur',
    });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
