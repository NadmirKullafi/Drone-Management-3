const express = require('express');
const router = express.Router();
const {
  merrDronat, merrStatistika, merrDronin, shto, perditeso, fshi, perditesoBateria
} = require('../controllers/droneController');
const { mbrojtAuth, vetemAdmin } = require('../middleware/auth');

router.get('/statistika', mbrojtAuth, merrStatistika);
router.get('/', mbrojtAuth, merrDronat);
router.get('/:id', mbrojtAuth, merrDronin);
router.post('/', mbrojtAuth, shto);
router.put('/:id', mbrojtAuth, perditeso);
router.delete('/:id', mbrojtAuth, vetemAdmin, fshi);
router.patch('/:id/bateria', mbrojtAuth, perditesoBateria);

module.exports = router;
