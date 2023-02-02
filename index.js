if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}


//console.log(process.env.Cloudinary_Key)
//console.log(process.env.Cloudinary_Secret)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const MongoStore = require('connect-mongo');

const User = require('./models/user');

// Comment out to switch between local mongoDB and the hosted mongoAtlasDB
const databaseURL = process.env.mongoDB_URL;
//const databaseURL = 'mongodb://localhost:27017/yelpcamp';

// for routing
const campRoutes = require('./routes/camps');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect(databaseURL, {
//mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false

});


const database = mongoose.connection;
database.on("error", console.error.bind(console, "Connection error:"));
database.once("open", () => {
    console.log("Database is connected [:");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// measure to prevent basic mongo-injection attack
app.use(mongoSanitize({
    replaceWith: '_'
}));
// !!!
// There's a whole video on this one app.use(), just look up 'Content
// Security Policy Fun'. When not set to false, it restricts what
// sources that data and code can be loaded from. If the code is 
// not listed in the object we set, it will filtered out.
// app.use(helmet({
//     contentSecurityPolicy: false,
//     crossOriginResourcePolicy: false,
// }));
// !!!

const secret = process.env.SECRET || 'thisisgrantssecret';

const store = MongoStore.create({
    mongoUrl: databaseURL,
    secret: 'thisisalsosecret',
    touchAfter: 60 * 60 * 24
    // this^ is in seconds
});

const sessionConfig = {
    secret,
    store,
    name: 'currentSession',
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60,
        //Date is in milliseconds, this is one hour
        //secure: true,
        httpOnly: true
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// each of these variables (currentUser, success, etc.) is
// available throughout the entire app.
// 'currentUser' is how we will track if there is a signed-in
// account
app.use((req, res, next) => {
    //console.log(req.session);
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//for routing
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

/* ------ */
/* Routes */
/* ------ */

/* 
    GET to register  - FORM
    POST to register - create a user
    GET to login - FORM
    POST to login to login
*/

app.get('/', (req, res) => {
    res.render('index');
})

// Error 404 handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Couldn\'t find that page', 404));
})

// Error handler - PLACEMENT MATTERS!! (Does not work if placed at top)
app.use((err, req, res, next) => {
    const{statusCode = 500} = err;
    if(!err.message) err.message = 'Something did not work right :/';
    res.status(statusCode).render('error', {err});
})

// Heroku will provide a process.env.PORT. The app will switch
// back to 2022 in local
const portNumber = process.env.PORT || 8888;
app.listen(portNumber, () => {
    console.log(`Running on port ${portNumber}`);
})