const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');


//Home index page that shows all campgrounds
router.get('/', async (req, res) => {
    //Find all campgrounds
    const campgrounds = await Campground.find({});
    //Render a page to show all the campgrounds, pass through the campgrounds
    //So we can use them in our campgrounds/index.ejs file
    res.render('campgrounds/index', { campgrounds });
})

//Get Route of Create CRUD
//Renders a page to fill out a form to create a new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

//Post route of Create CRUD
//This is where the form to create a new campground submits to
//Creates the new campground and redirects to the newly created campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//Show page for a campground
//Finds the campground by its id, and directs you to its specific page
//Where you can view one specific campground, and all of its information
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

//Edit/Update functionality of CRUD
//Triggered when you hit edit on a campground
//Finds the campground based off the ID youre at
//And renders an edit form to be filled out
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    //Find the campground using its id
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

//Update Functionality of CRUD
//Takes the information from the submitted edit form
//Processes all of it, and updates the campground in the database
router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    //Pass in ID and spread the req.body object
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

//Delete Route of CRUD
//Triggered when you press the delete button on a campground
//Deletes a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    //We need to find the campground before we delete it
    //And remove all of its associated data before deleting it
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}))

module.exports = router;