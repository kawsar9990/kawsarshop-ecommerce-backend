const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.submitReview); 
router.put('/update', reviewController.updateReview);
router.delete('/delete', reviewController.deleteReview)

module.exports = router;