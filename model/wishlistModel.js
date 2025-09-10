const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  residencyId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

wishlistSchema.index({ userId: 1, residencyId: 1 }, { unique: true });
// ✅ same property ko ek user do bar wishlist me add na kare

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
