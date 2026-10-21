/**
 * Stripe 50% Deposit Checkout Integration Route
 * Blueprint Section 6: Full Developer Technical Specification
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { bookingId, amountDue, route, cargo, email, phone } = body || {};

    if (!amountDue || amountDue <= 0) {
      return res.status(400).json({ error: 'Valid amountDue is required.' });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // Check if Stripe key is configured
    if (!stripeKey || stripeKey.includes('sk_test_placeholder') || stripeKey.trim() === '') {
      return res.status(200).json({
        simulated: true,
        checkoutUrl: null,
        message: 'Stripe Secret Key not configured in environment. Seamless 1-Click Card simulation is enabled.',
        bookingId: bookingId || 'TRK-' + Math.floor(1000 + Math.random() * 9000),
        amountDue
      });
    }

    const stripe = require('stripe')(stripeKey);
    const origin = req.headers.origin || req.headers.referer || process.env.APP_URL || 'http://localhost:3000';
    const cleanOrigin = origin.replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Freight Booking Deposit (50%) - Tracking #${bookingId}`,
            description: `Route: ${route || 'Freight Lane'} | Cargo: ${cargo || 'Freight/Vehicle'}`,
          },
          unit_amount: Math.round(parseFloat(amountDue) * 100), // Stripe expects cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${cleanOrigin}/?confirmed=true&tracking=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cleanOrigin}/?cancelled=true&tracking=${bookingId}`,
      metadata: {
        bookingId: String(bookingId),
        phone: String(phone || ''),
        route: String(route || '')
      }
    });

    return res.status(200).json({
      simulated: false,
      checkoutUrl: session.url,
      sessionId: session.id
    });
  } catch (err) {
    console.error('Stripe Checkout Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
