const express = require('express');
const router = express.Router({ mergeParams: true });

//Middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

//Models, for a Review & a Campground
const Campground = require('../models/campground');
const Review = require('../models/review');

//Joi Schemas for server side validations
const { reviewSchema } = require('../schemas.js');

//Utilities, for catching and handling errors
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/ExpressError');


//Displays the review upon submitting review form
router.post('/', validateReview, isLoggedIn, catchAsync(async (req, res) => {
    //Find the campground with the ID in the parameters
    const campground = await Campground.findById(req.params.id);
    //Make a new review object, and pass in the review information(body, rating)
    const review = new Review(req.body.review);
    //Push the review into the reviews array on our campground model
    review.author = req.user._id;
    campground.reviews.push(review);
    //Save both so they get loaded into DB
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    //redirect back to the campgrounds show page
    res.redirect(`/campgrounds/${campground._id}`);
}))

//We want to find the campground and remove this specific review from the reviews array
//Also have to remove it from reviews itself
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //Wait for it to find the campground, and remove the reference to
    //this review from the reviews array within that campground
    //Pull will take the id we gave it, and pull anything with that ID out of reviews
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    //Delete the review from the review DB
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    //Redirect to show page
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;