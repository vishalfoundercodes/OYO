const express = require("express");
const route = express.Router();
const {
  addBanners,
    getBanners,
    getBannerByTitle,
    updateBanner,
  deleteImageFromBanner,
} = require("../controller/bannerController.js");

route.post("/addbanner", addBanners);
route.get("/getbanner", getBanners);
route.get("/banners/title/:title", getBannerByTitle);
route.post("/banners/:id", updateBanner); // Update banner
route.post("/banner/:titleId/image/:imageId", deleteImageFromBanner);

module.exports = route;