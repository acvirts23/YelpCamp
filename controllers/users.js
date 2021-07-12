//Users controller

const User = require('../models/user');

//Renders the register form
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

//Actually does the registering of a new user
module.exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
        })
        req.flash('success', 'Welcome to yelp camp!');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

//Renders login form
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

//Does the authenticating and logging in
module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    //Delete the returnTo property from their session so it isnt wasting space
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

//Logs a user out
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}