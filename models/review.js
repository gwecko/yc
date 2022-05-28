const mongoose = require('mongoose');

//This part is a shortcut instead of typing mongoose.Schema every time
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    /* Campground review IDs will be stored as an array 
    on their respective campgrounds (the campground schema) 
    as a 'best practice' even though we are not expecting
    tons of reviews per campground. For our purposes, embedding 
    the whole review on a campground and NOT making a whole 
    review model would be OK, but we are going to go with the 
    review-IDs-in-an-array approach */
});

module.exports = mongoose.model("Review", ReviewSchema);
