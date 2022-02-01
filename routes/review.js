const express = require('express');
const advanceResult = require('../middleware/advanceResult');
const Review = require('../models/Review');
const { auth, authorize } = require('../middleware/auth');
const { getReviews, getReview, updateReview, deleteReview, createReview } = require('../controllers/reviews');
const router = express.Router({ mergeParams: true });


router
    .route('/')
    .get(advanceResult(Review, { path: 'bootcamp', select: 'name description' }), getReviews)
    .post(auth, authorize('user', 'admin'), createReview);

router
    .route('/:id')
    .get(getReview)
    .put(auth, updateReview)
    .delete(auth, deleteReview);

module.exports = router;