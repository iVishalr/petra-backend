const mongoose = require("mongoose");

const hotelListSchema = new mongoose.Schema({
  img: String,
  location: String,
  title: String,
  description: String,
  star: Number,
  price: String,
  total: String,
  hotelID: Number,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  type: String,
});

const hotelSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  City: String,
  State: String,
  Country: String,
  CityLocation: {
    latitude: Number,
    longitude: Number,
  },
  hotelList: [hotelListSchema],
});

module.exports = hotelSchema;
