const express = require("express");
const router = express.Router();
const { createCoupon, applyCoupon } = require("../controller/cupponController.js");

router.post("/create", createCoupon); // Admin
router.post("/applyCuppon", applyCoupon); // User

module.exports = router;
