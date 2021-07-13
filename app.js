
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//One of many engines used to parse ejs
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//Require our campground routes
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//Connect to our DB, will create the yelp-camp DB for us
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
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
app.use(express.urlencoded({ extended: true }));
//Pass in query string we want to use for our overrides
app.use(methodOverride('_method'));
//Tells express to serve our public assets from our 'public' folder
app.use(express.static(path.join(__dirname, 'public')))

//Sessions!
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    //store: Going to be a Mongo store eventually
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//Tells passport to use the local strategy, and use the authenticate
//method on our user model
passport.use(new LocalStrategy(User.authenticate()));
//Tells passport how to serialize a User
passport.serializeUser(User.serializeUser())
//Tells passport how to de-serialize a User
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    //Most of the time there will be nothing in req.flash
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
//Preface all campgrounds routes with '/campgrounds'
app.use('/campgrounds', campgroundRoutes);
//Preface all review routes with '/campgrounds/:id/reviews'
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

//This will only run if nothing else matched first and 
//We didnt respond from any of them
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no!, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})