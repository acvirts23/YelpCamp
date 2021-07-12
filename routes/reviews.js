const express = require('express');
const router = express.Router({ mergeParams: true });

//Middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

//Models, for a Review & a Campground
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

//Joi Schemas for server side validations
const { reviewSchema } = require('../schemas.js');

//Utilities, for catching and handling errors
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/ExpressError');


//Creates a review
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

//Deletes a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;