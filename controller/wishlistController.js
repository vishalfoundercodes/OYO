// const Wishlist=require("../model/wishlistModel.js")
// const Property = require("../model/propertyModel");
// // POST /wishlist/add
// const addToWishlist = async (req, res) => {
//   try {
//     const { userId, residencyId } = req.body;

//     const wishlistItem = await Wishlist.findOneAndUpdate(
//       { userId, residencyId },
//       { userId, residencyId },
//       { upsert: true, new: true }
//     );

//     res.json({ success: true,status:200, message: "Added to wishlist"});
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// // GET /wishlist/get
// const getWishList = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const wishlist = await Wishlist.find({ userId }).lean();

//     // ab property details chahiye
//     const propertyIds = wishlist.map((w) => w.residencyId);
//     console.log("propertyIds",propertyIds);
//     const properties = await Property.find({
//       residencyId: { $in: propertyIds },
//     });

//     res.json({
//       success: true,
//       status: 200,
//       count: properties.length,
//       data: properties,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// // Post /wishlist/delete
// const removeWishList = async (req, res) => {
//   try {
//     const { userId, residencyId } = req.body;

//     await Wishlist.findOneAndDelete({ userId, residencyId });

//     res.json({ success: true,status:200, message: "Removed from wishlist" });
//   } catch (error) {
//     res.status(500).json({ success: false,status:500, error: error.message });
//   }
// }

// module.exports = { addToWishlist, getWishList, removeWishList };

const Wishlist = require("../model/wishlistModel.js");
const Property = require("../model/propertyModel");

// POST /wishlist/toggle
const toggleWishlist = async (req, res) => {
  try {
    const { userId, residencyId } = req.body;

    // Check if already exists
    const existing = await Wishlist.findOne({ userId, residencyId });

    if (existing) {
      // Already exists → remove it
      await Wishlist.findOneAndDelete({ userId, residencyId });
      return res.json({
        success: true,
        status: 200,
        message: "Removed from wishlist",
        action: "removed",
      });
    } else {
      // Not exists → add it
      await Wishlist.create({ userId, residencyId });

      // Fetch property to return immediately
      const property = await Property.findOne({ residencyId });

      return res.json({
        success: true,
        status: 200,
        message: "Added to wishlist",
        action: "added"
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, status: 500, error: error.message });
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

module.exports = { toggleWishlist, getWishList };

