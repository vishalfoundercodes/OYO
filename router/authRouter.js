const express = require("express");
const route = express.Router();
const {
  addNewSignup,
  getLogin,
  authController,
} = require("../controller/authController.js");

// route.post("/register", addNewSignup);
route.post("/register", authController);
route.post("/login", getLogin);

module.exports = route;
