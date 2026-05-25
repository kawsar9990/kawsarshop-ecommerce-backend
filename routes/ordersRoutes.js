const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, updateOrderStatus, getOrdersByUserId, trackOrderPublic } = require('../controllers/OrderController');

router.post('/create', createOrder);
router.get('/user/:userId', getOrdersByUserId);
router.get('/track/:id', trackOrderPublic);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;