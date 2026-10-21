/**
 * API Health & Configuration Diagnostics
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CarrierDirect Logistics Freight & Auto Transport Quotation Engine',
    fmcsaDot: '#3892104',
    features: {
      zippopotamLookup: true,
      osrmRouting: true,
      speedTiers: true,
      depositCheckout50: true,
      nativeDeviceSms: true,
      hostingerSmtp: {
        configured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.SMTP_PORT) || 465
      },
      stripe: {
        configured: Boolean(process.env.STRIPE_SECRET_KEY)
      }
    }
  });
};
