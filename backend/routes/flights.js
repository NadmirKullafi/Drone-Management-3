const express = require('express');
const router = express.Router();
const {
  merrFluturimet, merrStatistika, merrFluturimin, krijo, perfundo, fshi
} = require('../controllers/flightController');
const { mbrojtAuth } = require('../middleware/auth');

router.get('/statistika', mbrojtAuth, merrStatistika);
router.get('/', mbrojtAuth, merrFluturimet);
router.get('/:id', mbrojtAuth, merrFluturimin);
router.post('/', mbrojtAuth, krijo);
router.put('/:id/perfundo', mbrojtAuth, perfundo);
router.delete('/:id', mbrojtAuth, fshi);

module.exports = router;
