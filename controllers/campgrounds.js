//Controller for campground

const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

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
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    //Make a new campground with everything in the req.body.campground
    const campground = new Campground(req.body.campground);
    //Add on geometry to the new campground
    campground.geometry = geoData.body.features[0].geometry;
    //Add in the different file URL's that came back from cloudinary
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    //Set the author to be the currently logged in user
    campground.author = req.user._id;
    //Save the campground/Add it to our DB
    await campground.save();
    console.log(campground);
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
    //Makes us the array
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    //Spreading it says dont pass in the array, just take the data from the array and pass that in
    campground.images.push(...imgs);
    console.log(campground)
    await campground.save();
    //If the request body has images to be deleted
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        //Pull from the images array, all images where the filenam is in the req.body.deleteImages array
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
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