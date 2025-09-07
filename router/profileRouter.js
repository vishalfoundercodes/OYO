const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controller/profileController");

// Get Profile
router.get("/profile/:userId", getProfile);

// Update Profile
router.post("/profile/:userId", updateProfile);

module.exports = router;
