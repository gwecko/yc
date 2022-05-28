const Review = require('../models/review');
const Camp = require('../models/campground');

module.exports.submitReview = async (req, res) => {
    // this is known as destructuring when we declare the variable like this
    const {id} = req.params;
    const campground = await Camp.findById(id);
    // this is the traditional way of declaring a variable
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review posted!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    // 'id' is the campground ID; 'reviewID' is the review... ID...
    const {id, reviewId} = req.params
    /* 
    BELOW:
    '{$pull: {reviews: reviewID}}' is an object. The $pull operator is pulling from the
    reviews array the reviewID (its removing the reference from the reviews array).
    */
    await Camp.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    // deleting the review
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted.');
    res.redirect(`/campgrounds/${id}`);
}