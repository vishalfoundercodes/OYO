const express = require("express");
const route = express.Router();
const {
  addNewSignup,
  getLogin,
  authController,
  changePassword,
  getAllUsers,
} = require("../controller/authController.js");

// route.post("/register", addNewSignup);
route.post("/authentication", authController);
route.post("/login", getLogin);
route.get("/getAlluser", getAllUsers);
route.post("/change-password", changePassword);

module.exports = route;
