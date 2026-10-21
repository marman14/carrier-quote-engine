/**
 * Stripe 100% Prepayment & 50% Deposit Checkout Integration Route
 * Section 3 & 4: Comprehensive Specification v2.0
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
    const { bookingId, amountDue, route, cargo, email, phone, payTerms } = body || {};

    if (!amountDue || amountDue <= 0) {
      return res.status(400).json({ error: 'Valid amountDue is required.' });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    const itemName = payTerms === 'full'
      ? `Freight Transport Prepayment (100% - 5% Discount) - Tracking #${bookingId}`
      : `Freight Transport Reservation Deposit (50%) - Tracking #${bookingId}`;

    // Check if Stripe key is configured
    if (!stripeKey || stripeKey.includes('sk_test_placeholder') || stripeKey.trim() === '') {
      return res.status(200).json({
        simulated: true,
        checkoutUrl: null,
        message: 'Direct payment simulation verified.',
        bookingId: bookingId || 'TRK-' + Math.floor(1000 + Math.random() * 9000),
        amountDue,
        payTerms: payTerms || 'full'
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
            name: itemName,
            description: `Route: ${route || 'Freight Lane'} | Vehicle: ${cargo || 'Vehicle Transport'}`,
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
        route: String(route || ''),
        payTerms: String(payTerms || 'full')
      }
    });

    return res.status(200).json({
      simulated: false,
      checkoutUrl: session.url,
      sessionId: session.id
    });
  } catch (err) {
    console.error('Payment Checkout Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
