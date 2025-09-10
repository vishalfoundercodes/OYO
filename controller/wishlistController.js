const Wishlist=require("../model/wishlistModel.js")
const Property = require("../model/propertyModel");
// POST /wishlist/add
const addToWishlist = async (req, res) => {
  try {
    const { userId, residencyId } = req.body;

    const wishlistItem = await Wishlist.findOneAndUpdate(
      { userId, residencyId },
      { userId, residencyId },
      { upsert: true, new: true }
    );

    res.json({ success: true,status:200, message: "Added to wishlist"});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// GET /wishlist/get
const getWishList = async (req, res) => {
  try {
    const { userId } = req.body;

    const wishlist = await Wishlist.find({ userId }).lean();

    // ab property details chahiye
    const propertyIds = wishlist.map((w) => w.residencyId);
    console.log("propertyIds",propertyIds);
    const properties = await Property.find({
      residencyId: { $in: propertyIds },
    });

    res.json({
      success: true,
      status: 200,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Post /wishlist/delete
const removeWishList = async (req, res) => {
  try {
    const { userId, residencyId } = req.body;

    await Wishlist.findOneAndDelete({ userId, residencyId });

    res.json({ success: true,status:200, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false,status:500, error: error.message });
  }
}

module.exports = { addToWishlist, getWishList, removeWishList };
