const mongoose = require('mongoose');
const Review = require('./review');

//We reference mongoose.Schema a lot
//So we make a variable to make it easier/shorter
const Schema = mongoose.Schema;

//Campground Model
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            //It is an ObjectId, From a Review model
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

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