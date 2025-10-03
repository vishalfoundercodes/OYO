const express = require("express");
const router = express.Router();
const { getUserCoupons } = require("../controller/Notification.js");

router.post("/notification", getUserCoupons);


module.exports = router;
