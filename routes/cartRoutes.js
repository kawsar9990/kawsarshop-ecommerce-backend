const express = require('express');
const router = express.Router();
const { syncCart, getCart } = require('../controllers/cartController');

router.post('/sync', syncCart);
router.get('/', getCart);

module.exports = router;