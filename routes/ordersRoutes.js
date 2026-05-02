const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, updateOrderStatus, getOrdersByUserId  } = require('../controllers/orderController');

router.post('/create', createOrder);
router.get('/user/:userId', getOrdersByUserId);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);


module.exports = router;