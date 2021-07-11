//Joi schemas that validate the data coming from req.body
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const Review = require('./models/review');

//Checks to see if a user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next()
};

//Validates the campground body, checking for all the required pieces
//If one is missing, it throws an error
module.exports.validateCampground = (req, res, next) => {
    //validate using the request body
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        //Map over the error.details to make a single string message
        const msg = error.details.map(el => el.message).join(',')
        //Pass the message to our Error class
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//Checks to see if the user is the author of the campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //Check if the current user on this request is the author of the campground
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    //Move on, you have permission to modify the campground!
    next();
}

//Validate review middleware
module.exports.validateReview = (req, res, next) => {
    //If something went wrong and theres an error in the req.body, we'll extract it
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        //Map over the error.details to make a single string message
        const msg = error.details.map(el => el.message).join(',')
        //Pass the message to our Error class
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//Checks to see if the user is the author of the Review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    //Check if the review author is the req.user.id
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    //Move on, you have permission to modify the campground!
    next();
}