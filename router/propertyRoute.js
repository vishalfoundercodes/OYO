const express = require("express");
const router = express.Router();
const {
  addProperty,
  getAllProperties,
  deleteProperty,
  filterProperties,
  addRoomsToProperty,
  updateRoomInProperty,
} = require("../controller/propertyController");


// routes
router.post("/addproperty", addProperty);
router.get("/getproperty", getAllProperties);

router.delete("/deleteproperty/:id", deleteProperty);
router.get("/filterproperty", filterProperties);
// GET /api/filterproperty?type=hotel
// GET /api/filterproperty?name=OYO
// GET /api/filterproperty?city=Delhi
// GET /api/filterproperty?state=UP
// GET /api/filterproperty?city=Delhi&state=UP
// GET /api/filterproperty?furnished=furnished
// GET /api/filterproperty?minPrice=1000
// GET /api/filterproperty?maxPrice=3000
// GET /api/filterproperty?minPrice=1000&maxPrice=3000
// GET /api/filterproperty?type=pg&city=Lucknow&furnished=semi-furnished&minPrice=2000&maxPrice=6000
// Add multiple rooms
router.post("/property/:residencyId/rooms", addRoomsToProperty);

// Update specific room by roomId
router.post("/property/:residencyId/room/:roomId", updateRoomInProperty);


module.exports = router;
