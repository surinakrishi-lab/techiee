const express = require('express');
const router = express.Router();
const store = require('../data/store');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
}

// POST /api/contact
router.post('/', async (req, res) => {
  const body = req.body || {};
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const company = String(body.company || '').trim() || '-';
  const need = String(body.need || '').trim();
  const budget = String(body.budget || '').trim() || '-';
  const message = String(body.message || '').trim();

  const errors = {};
  if (!name) errors.name = 'Name is required.';
  if (!email || !isValidEmail(email)) errors.email = 'A valid email is required.';
  if (!need) errors.need = 'Please select what you need.';
  if (!message) errors.message = 'Message is required.';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const entry = { name, email, company, need, budget, message };

  try {
    const saved = await store.append(entry);
    // Hook a real email/CRM integration here later (Nodemailer, HubSpot, etc.)
    return res.status(201).json({ ok: true, id: saved.id });
  } catch (err) {
    console.error('Failed to persist contact submission:', err.message);
    if (err.code === 'DB_NOT_CONNECTED') {
      return res.status(503).json({ ok: false, error: err.message });
    }
    return res.status(500).json({ ok: false, error: 'Could not save submission.' });
  }
});

// GET /api/contact - lightweight JSON read of stored leads (used by the
// admin view, and handy for debugging).
router.get('/', async (req, res) => {
  const submissions = await store.readAll();
  res.json({ ok: true, submissions });
});

module.exports = router;
