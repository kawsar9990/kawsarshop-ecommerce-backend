const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController')

router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);

module.exports = router;

