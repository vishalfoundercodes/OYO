const express = require("express");
const router = express.Router();
const {
  addProperty,
  getAllProperties,
  deleteProperty,
  filterProperties,
  addRoomsToProperty,
  updateRoomInProperty,
  addReview,
} = require("../controller/propertyController");


// routes
router.post("/addproperty", addProperty);
router.post("/getproperty", getAllProperties);

router.delete("/deleteproperty/:id", deleteProperty);
router.get("/filterproperty", filterProperties);
// GET /api/filterproperty?type=pg&city=Lucknow&furnished=semi-furnished&minPrice=2000&maxPrice=6000
// Add multiple rooms
router.post("/property/:residencyId/rooms", addRoomsToProperty);
router.post("/property/review", addReview);

// Update specific room by roomId
router.post("/property/:residencyId/room/:roomId", updateRoomInProperty);


module.exports = router;
