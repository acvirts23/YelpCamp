const mongoose = require('mongoose');
//We reference mongoose.Schema a lot
//So we make a variable to make it easier/shorter
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);