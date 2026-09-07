const express = require('express');
const router = express.Router();
const { contactLimiter } = require('../middleware/rateLimit');
const { honeypot } = require('../middleware/honeypot');
const { sendContactMessage } = require('../controllers/contactController');

router.post('/', contactLimiter, honeypot, sendContactMessage);

module.exports = router;
