const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerNewUser = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, err => {if (err) return next(err)});
        
        req.flash('success', `Welcome ${newUser.username}! Your account has been created.`);
        res.redirect('/campgrounds');
    } 
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginUserWithPassport = (req, res) => {
    const {username} = req.body
    req.flash('success', `${username} logged in`);
    
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Successful logout')
    res.redirect('/campgrounds');
}