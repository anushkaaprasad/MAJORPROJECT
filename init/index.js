const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('./models/listing.js');
const { init } = require('../models/listing');

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

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
   console.log('Data was initialized');
};
initDB();