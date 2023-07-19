const mongoose = require("mongoose");

const houseDetailsSchema = mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  bedrooms: {
    type: Number,
    required: true,
  },

  bathrooms: {
    type: Number,
    required: true,
  },

  roomSize: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },

  availabilityDate: {
    type: String,
    required: true,
  },

  rent: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

module.exports = houseDetailsSchema;
