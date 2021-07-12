//Controller for campground

const Campground = require('../models/campground');

//Home page that shows all campgrounds
module.exports.index = async (req, res) => {
    //Find all campgrounds
    const campgrounds = await Campground.find({});
    //Render a page to show all the campgrounds, pass through the campgrounds
    //So we can use them in our campgrounds/index.ejs file
    res.render('campgrounds/index', { campgrounds })
}

//Get route to make a new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

//Post route to make a new campground
module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

//Show page for a campground
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

//Get route to render an edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    //Find the campground using its id
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

//Updates the campground when the form is submitted
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    //Pass in ID and spread the req.body object
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    //We need to find the campground before we delete it
    //And remove all of its associated data before deleting it
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}