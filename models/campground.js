const mongoose = require('mongoose');
const Review = require('./review');

//This part is a shortcut instead of typing mongoose.Schema every time
const Schema = mongoose.Schema;


// By default, Mongoose does not include virtual properties when
// converting to JSON. This line fixes that. We pass it in at the 
// end of the 'campSchema'.
const opts = {toJSON: {virtuals: true}};


// Virtual properties can only be added to a schema. We translated our old images object
// to a schema because it was an array, and thus could not have virtual properties.
const ImageSchema = new Schema({
    url: String, 
    filename: String
})
// The 'w_150' is a shortcut of cloudinary. On the website they have a variety
// of things you can do with images through the API
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_150');
})


const CampSchema = new Schema({
    title: String, 
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        }, 
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String, 
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' /* (The name given to the user model; case sensitive) */
    },
    /* Campground review IDs are being stored as an array 
    on their respective campgrounds (this campground schema) 
    as a 'best practice' even though we are not expecting
    tons of reviews per campground. For our purposes, embedding 
    the whole review on a campground and NOT making a whole 
    review model would be OK, but we are going to go with the 
    review-IDs-in-an-array approach */
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review' /* (The name given to the review model; case sensitive) */
        }
    ]
}, opts);

CampSchema.virtual('properties.popupMarkup').get(function() {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
})



// This is QUERY middleware (the other type is document middleware)
CampSchema.post('findOneAndDelete', async function(doc) {
    // Everything is wrapped in the 'if' statement because something may not always be found
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
            // ^^ "the ID for each review is somewhere in our doc.reviews"
        })
    }
})

module.exports = mongoose.model('Camp', CampSchema);