/* Execute this file to seed a database */
/* Edit the value of 'i' in the loop to change the number of seeds.  
    The database is cleared each time new seeds are created.
*/

const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
const Camp = require('../models/campground');

const numberOfCities = 1000;

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});


const database = mongoose.connection;
database.on("error", console.error.bind(console, "Connection error:"));
database.once("open", () => {
    console.log("Database is connected [:");
});

/* This is a function; 
    We pass in an array and it selects a random entry */
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// This is also a function
const seedDatabase = async () => {
    await Camp.deleteMany({});
    for(let i = 0; i < 40; i++){
        const randomCityNumber = Math.floor(Math.random() * numberOfCities);
        const randomPrice = Math.floor(Math.random() * 25 +10);
        const newCamp = new Camp({
            author: '6241ea8a5a03e9d5684a1ae4', // this is the object ID for user 'yoyo' 
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[randomCityNumber].longitude, 
                    cities[randomCityNumber].latitude
                ]
            },
            location: `${cities[randomCityNumber].city}, ${cities[randomCityNumber].state}`,
            description: 'mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat semper viverra nam libero justo laoreet sit amet cursus sit amet dictum sit amet justo donec enim diam vulputate ut pharetra sit amet aliquam id diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque viverra justo nec',
            price: randomPrice, 
            images: [
                {
                    url: 'https://res.cloudinary.com/dkquthcui/image/upload/v1649030507/yelpcamp/lz4jeaqcub1mkl1qk5kb.jpg',
                    filename: 'yelpcamp/lz4jeaqcub1mkl1qk5kb'
                }, 
                {
                    url: 'https://res.cloudinary.com/dkquthcui/image/upload/v1649030509/yelpcamp/fga2oii9iippk3ilhkze.jpg',
                    filename: 'yelpcamp/fga2oii9iippk3ilhkze'
                }
            ]
        })
        await newCamp.save();
    }
}

/* We close the connection after running the function; '.then()' can be called
because we defined the function to return a promise */
seedDatabase().then(() => {
    mongoose.connection.close()
    console.log("Connection closed");
});
