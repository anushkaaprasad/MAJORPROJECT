const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type:String,
        required: true
    },

    description: String,
    image:{type:String,
        default:"https://assets.clevelandclinic.org/transform/LargeFeatureImage/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg.jpg",
        set:(v)=> v===""?"https://assets.clevelandclinic.org/transform/LargeFeatureImage/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg.jpg":v
    },
    price: Number,
    location: String,
    rating: Number, 
    country: String
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
