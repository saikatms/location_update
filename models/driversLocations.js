const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const driverLocationsSchema = new mongoose.Schema({
  driverId: {
    type: ObjectId,
    ref: "Drivers",
  },
  coordinate: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  socketId: {
    type: String,
    required: true,
  },
});

mongoose.model("DriverLocations", driverLocationsSchema);
