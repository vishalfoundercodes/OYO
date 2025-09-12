const express = require('express');
const {
  addOnboardPage,
  getOnboardPages,
  removeOnboardPage,
} = require("../controller/onboardPageController.js");
const route = express.Router();
route.post('/addonboardpage', addOnboardPage);
route.get('/getonboardpage', getOnboardPages);
route.post("/removeOnboardPage", removeOnboardPage);
module.exports = route;
