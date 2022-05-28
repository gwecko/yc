const express = require('express');
const router = express.Router({mergeParams: true});

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

const review = require('../controllers/reviews');



// SUBMIT a campground REVIEW
router.post('/', validateReview, isLoggedIn, catchAsync(review.submitReview))

// DELETE a campground REVIEW
// We delete both the review and the reference to the review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview))



module.exports = router;