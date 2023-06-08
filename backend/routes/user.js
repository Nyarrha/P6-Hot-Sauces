// Importation modules, controller et middleware
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const pwValidator = require('../middleware/pw-validator');
const rateLimit = require('../middleware/rate-limit');

// Routes user
router.post('/signup', pwValidator, userCtrl.signup);
router.post('/login', rateLimit.login, userCtrl.login);

// Exportation express
module.exports = router;