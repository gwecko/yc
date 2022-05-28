const express = require('express');
const router = express.Router();

// image upload and storage
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const Camp = require('../models/campground');
const Review = require('../models/review');

const campgrounds = require('../controllers/campgrounds')

const {campgroundSchema} = require('../schemas')
const {validateCampground, isLoggedIn, isAuthor} = require('../middleware');

const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError');
const { cloudinary } = require('../cloudinary');


/* 
    Reminder that route ordering matters!
    Ex. If '/new' goes after '/:id', then the browser interprets 'new' as just
    another id route, which is not what we want. So '/new' has to go first. 
*/


router.route('/')
    // Show all campgrounds
    .get(catchAsync(campgrounds.index))
    // Post a new campground
    .post(isLoggedIn, upload.array('imageFromMulter'), validateCampground, catchAsync(campgrounds.postNewCampground));

// Creating new campground page
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    // Campground render
    .get(catchAsync(campgrounds.renderCampground))
    // A campground edit submission. 'Put' request is a method-override for a 'post' request
    .put(isLoggedIn, isAuthor, upload.array('imageFromMulter'), validateCampground, catchAsync(campgrounds.submitCampgroundEdit))
    // Delete a campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Route to EDIT a camp page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderCampgroundEditForm))


module.exports = router;

