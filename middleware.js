const Camp = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require('./schemas');

const ExpressError = require('./utilities/ExpressError');



module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        // log each error to the client
        const msg = error.details.map(eachElement => eachElement.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// server-side validation
module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        // log each error to the client
        const msg = error.details.map(eachElement => eachElement.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // stores the URL that we were at before login page
        req.session.returnTo = req.originalUrl;
        
        req.flash('error', 'You must be signed in to create a post');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Camp.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'Invalid credentials.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        //console.log(req.params);
        req.flash('error', 'Invalid credentials.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}