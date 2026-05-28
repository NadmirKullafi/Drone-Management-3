const express = require('express');
const router = express.Router();
const { regjistro, hyrje, merrProfil, perditesoProfil } = require('../controllers/authController');
const { mbrojtAuth } = require('../middleware/auth');

router.post('/regjistro', regjistro);
router.post('/hyrje', hyrje);
router.get('/profili', mbrojtAuth, merrProfil);
router.put('/profili', mbrojtAuth, perditesoProfil);

module.exports = router;
