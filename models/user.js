const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true, 
        unique: true
    }
});


//Using 'passport' is great, but not a good teaching tool
//This line is going to do a lot for us, such as
//check for duplicate usernames, matching username/password, etc.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);