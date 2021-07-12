const Campground = require('../models/campground');
const Review = require('../models/review');

//Create a new review
module.exports.createReview = async (req, res) => {
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
}

//Delete a review
module.exports.deleteReview = async (req, res) => {
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
}
