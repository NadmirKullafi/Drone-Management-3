const express = require('express');
const router = express.Router();
const { merrAlarmet, krijo, lexo, zgjidh } = require('../controllers/alertController');
const { mbrojtAuth } = require('../middleware/auth');

router.get('/', mbrojtAuth, merrAlarmet);
router.post('/', mbrojtAuth, krijo);
router.put('/:id/lexo', mbrojtAuth, lexo);
router.put('/:id/zgjidh', mbrojtAuth, zgjidh);

module.exports = router;
