const express = require("express");
const router = express.Router();
const {
  addProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controller/propertyController");

// routes
router.post("/addproperty", addProperty);
router.get("/getproperty", getAllProperties);
router.get("/getproperty/:id", getPropertyById);
router.put("/updateproperty/:id", updateProperty);
router.delete("/deleteproperty/:id", deleteProperty);

module.exports = router;
