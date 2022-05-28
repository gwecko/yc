const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    // the first variable has to be what it is, but the
    // process.env.xxxxxxx is whatever we named it in the 
    // .env file
    cloud_name: process.env.Cloudinary_Cloud_Name, 
    api_key: process.env.Cloudinary_Key,
    api_secret: process.env.Cloudinary_Secret
});

const storage = new CloudinaryStorage({
    cloudinary, 
    params: {
        folder: 'yelpcamp', 
        allowedFormats: ['jpeg', 'jpg', 'png', 'pdf', 'heic']
    }
});

module.exports = {
    cloudinary,
    storage
}