const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/voucher');


router.post('/verify-voucher', OrderController.verifyVoucher);

module.exports = router;

