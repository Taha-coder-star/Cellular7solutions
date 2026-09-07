const rateLimit = require('express-rate-limit');

// Public form submissions (repairs, buy/sell, reviews, orders) — generous
// enough for a real customer, tight enough to blunt bot floods.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions from this IP. Please try again later.' },
});

// Admin login — brute-force protection, keyed by IP regardless of the
// email tried so an attacker can't rotate emails to dodge the limit.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
});

// Contact form — tighter than the general form limiter since it sends real
// email via SMTP (cost + spam risk), not just a DB write.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions from this IP. Please try again later.' },
});

module.exports = { formLimiter, loginLimiter, contactLimiter };
