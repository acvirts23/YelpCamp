const mongoose = require('mongoose');
const Review = require('./review');

//We reference mongoose.Schema a lot
//So we make a variable to make it easier/shorter
const Schema = mongoose.Schema;

//Image Model
const ImageSchema = new Schema({
    url: String,
    filename: String,
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON: {virtuals: true}};


//Campground Model
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            //It is an ObjectId, From a Review model
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
})

//When a campground is deleted, its info is still passed to this middleware
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    //If a document was found
    if (doc) {
        //Remove all reviews
        await Review.deleteMany({
            //If their id was found in our documents reviews
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);