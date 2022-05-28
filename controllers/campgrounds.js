const Camp = require('../models/campground');

// We found how to do this under the 'Creating Clients' section in mapbox github
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.Mapbox_Token;
const geoCoder = mapbox({accessToken: mapboxToken});

const cloudinary = require('cloudinary');

// ---------------------------------------------

module.exports.index = async (req, res) => {
    const campgrounds = await Camp.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new'); 
}

//posts after successful validation
module.exports.postNewCampground = async (req, res, next) => {
    const mapData = await geoCoder.forwardGeocode({
        query: req.body.campground.location, 
        limit: 1
    }).send();
    const campground = new Camp(req.body.campground);
    /*  
    file.path and file.filename are variables taken from  the campground object. 
    We can see them by console.log(req.body, req.files) after a new post */
    campground.images = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.geometry = mapData.body.features[0].geometry; 
    campground.author = req.user._id;
    await campground.save();
    //
    console.log(campground);
    //
    req.flash('success', 'Campground created successfully!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.renderCampground = async (req, res) => {
    const campground = await Camp.findById(req.params.id)
        .populate({
            path: 'reviews', // populate the reviews
            populate :{ // then populate the authors of those reviews
                path: 'author'
        }})
        .populate('author'); // and lastly the author of the campground
    if(!campground){
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds')
    }
    console.log(campground.geometry);
    res.render('./campgrounds/sitePage', {campground});
}

module.exports.renderCampgroundEditForm = async (req, res) => {
    const campground = await Camp.findById(req.params.id);
    // check to see if campground exists
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit', {campground});
}

module.exports.submitCampgroundEdit = async (req, res) => {
    const {id} = req.params;
    const campground = await Camp.findByIdAndUpdate(id, {...req.body.campground});
    
    const newImages = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.images.push(...newImages);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        // "pull from the images array any filename that is contained within the deleteImages array"
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    console.log(req.body);
    req.flash('success', `Edit made to ${campground.title}!`)
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Camp.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}