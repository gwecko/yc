const express = require('express');
const passport = require('passport')
const catchAsync = require('../utilities/catchAsync');
const users = require("../controllers/users");
const router = express.Router()
const flash = require('connect-flash');


router.route('/register')
    // render the user registration page
    .get(users.renderRegister)
    // create the new user
    .post(catchAsync(users.registerNewUser));

router.route('/login')
    // render the login page
    .get(users.renderLogin)
    // using passport.authenticate, login an existing user account
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUserWithPassport);

// logout
router.get('/logout', users.logoutUser)

module.exports = router;