const express = require("express");
const route = express.Router();
const {
  addToWishlist,
  getWishList,
  removeWishList,
} = require("../controller/wishlistController");

route.post("/wishlist/add", addToWishlist);
route.post("/wishlist/get", getWishList);
route.post("/wishlist/delete", removeWishList);

module.exports = route;
