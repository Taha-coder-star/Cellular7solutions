const express = require('express');
const router = express.Router();
const { loginLimiter } = require('../middleware/rateLimit');
const { adminLogin } = require('../controllers/adminController');

router.post('/login', loginLimiter, adminLogin);

module.exports = router;
