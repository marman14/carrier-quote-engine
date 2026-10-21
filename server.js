const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// API routes matching Vercel serverless functions
const createDepositCheckout = require('./api/create-deposit-checkout');
const sendEmail = require('./api/send-email');
const healthCheck = require('./api/health');

app.all('/api/create-deposit-checkout', (req, res) => createDepositCheckout(req, res));
app.all('/api/send-email', (req, res) => sendEmail(req, res));
app.all('/api/health', (req, res) => healthCheck(req, res));

// Fallback to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ CarrierDirect Logistics Engine running at http://localhost:${PORT}`);
});
