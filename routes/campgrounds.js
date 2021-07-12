const express = require('express');
const router = express.Router();
//Campgrounds object that represents our campground controller
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
//Middleware
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');

router.route('/')
    //Home/index page that shows all campgrounds
    .get(catchAsync(campgrounds.index))
    //Creates the new campground
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

//Renders a form to create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    //Show page for a single campground
    .get(catchAsync(campgrounds.showCampground))
    //Edits a campground and modifies its data when the edit form is submitted
    .put(isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampground))
    //Deletes a campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

//Renders the edit form to edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;