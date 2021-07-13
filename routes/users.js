const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
//Require users controller
const users = require('../controllers/users');

router.route('/register')
    //Renders the register form
    .get((users.renderRegisterForm))
    //Registers the user, and adds them to our database
    .post(catchAsync(users.register))

router.route('/login')
    //Renders the login form
    .get(users.renderLogin)
    //Authenticates the users login, verifies they exist in our DB
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout);

module.exports = router;