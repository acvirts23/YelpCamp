const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//One of many engines used to parse ejs
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

//Connect to our DB, will create the yelp-camp DB for us
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//Makes it easier to call mongoose.connection
const db = mongoose.connection;
//Basic logic for error checking for connecting to our DB
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

//Tell our app to use this engine instead of the default one
app.engine('ejs', ejsMate);
//Need to use ejs
app.set('view engine', 'ejs');
//So it looks in our views folder
app.set('views', path.join(__dirname, 'views'))

//So our req.body's are parsed by browser
app.use(express.urlencoded({extended: true}));
//Pass in query string we want to use for our overrides
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
})
app.get('/campgrounds', async(req, res) => {
    //Find all campgrounds
    const campgrounds = await Campground.find({});
    //Render a page to show all the campgrounds, pass through the campgrounds
    //So we can use them in our campgrounds/index.ejs file
    res.render('campgrounds/index', { campgrounds });
})

//Get Route of Create CRUD
app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new')
})

//Post route of Create CRUD
app.post('/campgrounds', async(req, res) =>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})
app.get('/campgrounds/:id', async(req, res) =>{
    //Find the campground using its id
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
})

//Edit/Update functionality of CRUD
app.get('/campgrounds/:id/edit', async(req, res)=>{
    //Find the campground using its id
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
})

//Update Functionality of CRUD
app.put('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    //Pass in ID and spread the req.body object
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

//Delete Route of CRUD
app.delete('/campgrounds/:id', async(req, res)=>{
    const {id} = req.params;
    //We need to find the campground before we delete it
    //And remove all of its associated data before deleting it
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})