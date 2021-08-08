const mongoose = require("mongoose");

const reactorSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Model: {
    type: String,
    required: true,
  },
  Process: {
    type: String,
    required: true,
  },
  Capacity: {
    type: Number,
    required: true,
  },
  GridConnectionDate: {
    type: String,
    required: true,
  },
  LoadFactor: {
    type: Number,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const Reactor = mongoose.model("Reactor", reactorSchema);
module.exports = Reactor;
