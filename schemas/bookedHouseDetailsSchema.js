const mongoose = require("mongoose");

const bookedHouseDetailsSchema = mongoose.Schema({
  renterName: {
    type: String,
    required: true,
  },
  renterEmail: {
    type: String,
    required: true,
  },
  renterPhone: {
    type: String,
    required: true,
  },
  houseId: {
    type: String,
    required: true,
  },
});

module.exports = bookedHouseDetailsSchema;
