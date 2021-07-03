//We will call this file whenvever we want to seed our data
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//Pass in the array
//We return a random element from that array
const sample = array => array[Math.floor(Math.random() * array.length)];

//Fills our DB with 50 random campground locations
const seedDB = async () => {
    //Start by deleting everything
    await Campground.deleteMany({});
    //Loop 50 times
    for (let i = 0; i < 50; i++) {
        //Give us a number from 1 to 1000
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //Picks a random city and State
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            //Grabs a random descriptor and place for our title from our SeedHelpers file
            title: `${sample(descriptors)} ${sample(places)}`,
            //Add a random image from unsplash
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, error! Facere id porro atque adipisci quae dolor illo ea ipsa commodi non vel vero fugit sit, dolorem harum quod beatae!",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})