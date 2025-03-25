const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main()
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL); // Call connect() here
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

//app.get('/testlistings', (req, res) => {
//   let sampleListing = new Listing({
//        title: 'Apple',
//       description: 'A fruit',
//        image: 'https://assets.clevelandclinic.org/transform/LargeFeatureImage/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg.jpg',
//        price: 60,
//        location: 'USA',
//        rating: 5,
//        country: 'USA'
//   });

//    sampleListing.save();
//    console.log('Listing saved');
//    res.send('Successful tesing');
// });

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});