const express = require('express');
const router = express.Router();

const{ 
  getOrderDataForReturn, 
  applyReturn, 
  cancelReturnByUser, 
  updateReturnStatusByAdmin,
  getReturnHistoryByUser
} = require('../controllers/returnController');


router.get('/order-data/:orderId', getOrderDataForReturn);
router.post('/apply', applyReturn);
router.put('/user-cancel', cancelReturnByUser);
router.put('/admin-update', updateReturnStatusByAdmin);
router.get('/user', getReturnHistoryByUser);

module.exports = router;