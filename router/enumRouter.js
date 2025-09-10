const express = require("express");
const route = express.Router();
const {
  addOption,
  removeOption,
  getOptions,
} = require("../controller/enumController.js");

// Admin
route.post("/enum/add", addOption);
route.post("/enum/remove", removeOption);

// Frontend
route.get("/getenum", getOptions);

module.exports = route;
