const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const DriverLocation = mongoose.model("DriverLocations");

//get nearby drivers
router.get("/driverLocation", (req, res) => {
  console.log(parseFloat(req.body.latitude));
  DriverLocation.ensureIndexes({ coordinates: "2dsphere" });

  DriverLocation.find(
    {
      coordinate: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [3.145909, 101.698545],
          },
          $maxDistance: 10000,
        },
      },
    },
    (err, location) => {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        res.send(location);
      }
    }
  );
});

//update driver socket id
router.put("/driverLocationSocket/:id", (req, res) => {
  var io = req.app.io;
  if (!req.body) {
    res.status(400);
    res.json({
      error: "Bad data",
    });
  } else {
    DriverLocation.updateOne(
      { _id: req.params.id },
      { $set: { socketId: req.body.socketId } },
      (err, updateDetails) => {
        if (err) {
          res.send(err);
        } else {
          res.send(updateDetails);
        }
      }
    );
  }
});

//Update Location by driver to user
router.put("/driverLocation/:id", (req, res) => {
  var io = req.app.io;
  var location = req.body;
  var latitude = parseFloat(location.latitude);
  var longitude = parseFloat(location.longitude);

  if (!location) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    DriverLocation.updateOne(
      { _id: req.params.id },
      {
        $set: {
          socketId: location.socketId,
          coordinate: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
      (err, updateDetails) => {
        if (err) {
          console.log(updateDetails);
          res.send(err);
        }
        if (updateDetails) {
          //Get updated location
          DriverLocation.findOne(
            {
              _id: req.params.id,
            },
            (error, updateLocation) => {
              if (error) {
                res.send(error);
              }
              res.send(updateLocation);
            }
          );
        }
      }
    );
  }
});

module.exports = router;
