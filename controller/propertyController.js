// controllers/propertyController.js
const Property = require("../model/propertyModel");
const Wishlist = require("../model/wishlistModel"); 
const EnumModel = require("../model/EnumModel"); // ✅ path sahi apne project ke hisaab se lagana

// Helper function for enum validation
async function validateEnum(category, value) {
  const enumDoc = await EnumModel.findOne({ category });
  if (!enumDoc) return false;

  return enumDoc.options.some((opt) => opt.value === value);
}


// @desc Add new property
// const addProperty = async (req, res, next) => {
  // try {
  //   // Check if body exists
  //   if (!req.body || Object.keys(req.body).length === 0) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Request body is empty or not properly parsed",
  //       debug: {
  //         contentType: req.headers["content-type"],
  //         bodyExists: !!req.body,
  //         bodyType: typeof req.body,
  //       },
  //     });
  //   }

  //   // Destructure all expected fields from the body
  //   const {
  //     userId,
  //     userType,
  //     name,
  //     type,
  //     address,
  //     city,
  //     state,
  //     pincode,
  //     coordinates,
  //     mainImage,
  //     images,
  //     pricePerNight,
  //     pricePerMonth,
  //     depositAmount,
  //     rooms = [], // ✅ default empty array
  //     amenities,
  //     rules,
  //     contactNumber,
  //     email,
  //     website,
  //     rating,
  //     reviews,
  //     availableRooms,
  //     owner,
  //     description,
  //     isAvailable,
  //   } = req.body;

  //   // Validate required fields
  //   if (!name || !type || !address || !city || !state) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Missing required fields",
  //       required: ["name", "type", "address", "city", "state"],
  //       received: {
  //         name: !!name,
  //         type: !!type,
  //         address: !!address,
  //         city: !!city,
  //         state: !!state,
  //       },
  //     });
  //   }

  //   // Generate residencyId
  //   const lastresidencyId = await Property.findOne({})
  //     .sort({ residencyId: -1 })
  //     .lean();
  //   const nextresidencyId =
  //     lastresidencyId && lastresidencyId.residencyId
  //       ? lastresidencyId.residencyId + 1
  //       : 1;

  //   // ✅ Generate roomId automatically (per property starting from 1)
  //   let roomCounter = 1;
  //   const roomsWithId = rooms.map((room) => {
  //     return { ...room, roomId: roomCounter++ };
  //   });

  //   // Build the property object explicitly
  //   const propertyData = {
  //     userId,
  //     userType,
  //     residencyId: nextresidencyId,
  //     name,
  //     type,
  //     address,
  //     city,
  //     state,
  //     pincode,
  //     coordinates,
  //     mainImage,
  //     images,
  //     pricePerNight,
  //     pricePerMonth,
  //     depositAmount,
  //     rooms: roomsWithId, // ✅ auto roomId applied
  //     amenities,
  //     rules,
  //     contactNumber,
  //     email,
  //     website,
  //     rating,
  //     reviews,
  //     availableRooms,
  //     owner,
  //     description,
  //     isAvailable,
  //   };

  //   // Attach owner if logged-in user is available
  //   if (req.user) {
  //     propertyData.owner = req.user._id;
  //   }

  //   const newProperty = new Property(propertyData);
  //   const savedProperty = await newProperty.save();

  //   res.status(201).json({
  //     success: true,
  //     message: "Property added successfully",
  //     status: 200,
  //   });
  // } catch (err) {
  //   // console.error("Error adding property:", err);
  //   next(err); // pass error to global error handler
  // }
// };

// @desc Get all properties
const addProperty = async (req, res, next) => {
  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty or not properly parsed",
        debug: {
          contentType: req.headers["content-type"],
          bodyExists: !!req.body,
          bodyType: typeof req.body,
        },
      });
    }

    // Destructure all expected fields from the body
    const {
      userId,
      userType,
      name,
      type,
      address,
      city,
      state,
      pincode,
      coordinates,
      mainImage,
      images,
      pricePerNight,
      pricePerMonth,
      depositAmount,
      rooms = [], // ✅ default empty array
      amenities,
      rules,
      contactNumber,
      email,
      website,
      rating,
      reviews,
      availableRooms,
      owner,
      description,
      isAvailable,
    } = req.body;

    // Validate required fields
    if (!name || !type || !address || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["name", "type", "address", "city", "state"],
        received: {
          name: !!name,
          type: !!type,
          address: !!address,
          city: !!city,
          state: !!state,
        },
      });
    }

    // ✅ Property Type validate
    const validType = await validateEnum("propertyType", type);
    if (!validType) {
      return res.status(400).json({ message: "Invalid property type" });
    }

    // ✅ Rooms validate
    for (let room of rooms) {
      if (room.roomType) {
        const validRoomType = await validateEnum("roomType", room.roomType);
        if (!validRoomType) {
          return res
            .status(400)
            .json({ message: `Invalid room type: ${room.roomType}` });
        }
      }

      if (room.furnished) {
        const validFurnished = await validateEnum(
          "furnishedType",
          room.furnished
        );
        if (!validFurnished) {
          return res
            .status(400)
            .json({ message: `Invalid furnished type: ${room.furnished}` });
        }
      }
    }

    // Generate residencyId
    const lastresidencyId = await Property.findOne({})
      .sort({ residencyId: -1 })
      .lean();
    const nextresidencyId =
      lastresidencyId && lastresidencyId.residencyId
        ? lastresidencyId.residencyId + 1
        : 1;

    // ✅ Generate roomId automatically (per property starting from 1)
    let roomCounter = 1;
    const roomsWithId = rooms.map((room) => {
      return { ...room, roomId: roomCounter++ };
    });

    // Build the property object explicitly
    const propertyData = {
      userId,
      userType,
      residencyId: nextresidencyId,
      name,
      type,
      address,
      city,
      state,
      pincode,
      coordinates,
      mainImage,
      images,
      pricePerNight,
      pricePerMonth,
      depositAmount,
      rooms: roomsWithId, // ✅ auto roomId applied
      amenities,
      rules,
      contactNumber,
      email,
      website,
      rating,
      reviews,
      availableRooms,
      owner,
      description,
      isAvailable,
    };

    // Attach owner if logged-in user is available
    if (req.user) {
      propertyData.owner = req.user._id;
    }

    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      status: 200
    });
  } catch (err) {
    console.error("Error adding property:", err);
    next(err); // pass error to global error handler
  }
};
// @desc Get all properties
const getAllProperties = async (req, res, next) => {
  try {
    const { userId } = req.query; // frontend se ?userId=2 bhejna login hone par

    // sabhi properties fetch karo
    const properties = await Property.find()
      .populate({
        path: "owner",
        match: { type: 1 }, // only vendor owners
        select: "name email userId type",
      })
      .lean();

    let wishlistIds = [];
    if (userId) {
      // us user ki wishlist fetch karo
      const wishlist = await Wishlist.find({ userId }).lean();
      wishlistIds = wishlist.map((w) => w.residencyId);
    }

    // properties ke andar wishlist status inject karo
    const modified = properties.map((p) => ({
      ...p,
      wishlist: userId ? wishlistIds.includes(p.residencyId) : false,
    }));

    // wishlist count
    const wishlistCount = userId ? wishlistIds.length : 0;

    res.status(200).json({
      success: true,
      count: modified.length,
      wishlistCount,
      data: modified,
    });
  } catch (error) {
    next(error);
  }
};

// @desc add room property
const addRoomsToProperty = async (req, res, next) => {
  try {
    const { residencyId } = req.params;
    const { rooms } = req.body; // array of room objects

    const property = await Property.findOne({ residencyId });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Find last roomId inside this property
    let lastRoomId =
      property.rooms.length > 0
        ? Math.max(...property.rooms.map((r) => r.roomId || 0))
        : 0;

    const roomsWithId = rooms.map((room) => {
      lastRoomId += 1;
      return { ...room, roomId: lastRoomId };
    });

    property.rooms.push(...roomsWithId);

    // Update total availableRooms
    property.availableRooms = property.rooms.reduce(
      (sum, room) => sum + (room.availableUnits || 0),
      0
    );

    await property.save();

    res.status(200).json({
      success: true,
      message: "Rooms added successfully",
      status: 200
    });
  } catch (error) {
    // console.error("Error adding rooms:", error);
    next(error);
  }
};

// @desc Update room in property
const updateRoomInProperty = async (req, res, next) => {
  try {
    const { residencyId, roomId } = req.params; // roomId from URL
    const updates = req.body;

    const property = await Property.findOne({ residencyId });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const room = property.rooms.find((r) => r.roomId === parseInt(roomId));
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const allowedFields = [
      "roomType",
      "furnished",
      "occupancy",
      "price",
      "amenities",
      "availableUnits",
      "images",
    ];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        room[field] = updates[field];
      }
    });

    // Recalculate total availableRooms
    property.availableRooms = property.rooms.reduce(
      (sum, r) => sum + (r.availableUnits || 0),
      0
    );

    await property.save();

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      status: 200
    });
  } catch (error) {
    // console.error("Error updating room:", error);
    next(error);
  }
};

// @desc Delete property
const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    // console.error("Error deleting property:", error);
    next(error); // ✅
  }
};

// @desc Filter properties
const filterProperties = async (req, res, next) => {
  try {
    let { type, name, city, state, furnished, minPrice, maxPrice } = req.query;

    let filter = {};

    // Clean up query params (ignore "null", "undefined", or empty string)
    const isValid = (val) =>
      val !== undefined && val !== null && val !== "" && val !== "null" && val !== "undefined";

    // type filter
    if (isValid(type)) {
      filter.type = type; // exact match hotel/pg/apartment
    }

    // name search (case-insensitive)
    if (isValid(name)) {
      filter.name = { $regex: name, $options: "i" };
    }

    // city filter
    if (isValid(city)) {
      filter.city = { $regex: city, $options: "i" };
    }

    // state filter
    if (isValid(state)) {
      filter.state = { $regex: state, $options: "i" };
    }

    // furnished filter (check inside rooms array)
    if (isValid(furnished)) {
      filter["rooms.furnished"] = furnished;
    }

    // price filter (both night and month basis)
    if (isValid(minPrice) || isValid(maxPrice)) {
      filter.$or = [];

      let priceFilterNight = {};
      let priceFilterMonth = {};

      if (isValid(minPrice)) {
        priceFilterNight.$gte = Number(minPrice);
        priceFilterMonth.$gte = Number(minPrice);
      }
      if (isValid(maxPrice)) {
        priceFilterNight.$lte = Number(maxPrice);
        priceFilterMonth.$lte = Number(maxPrice);
      }

      filter.$or.push({ pricePerNight: priceFilterNight });
      filter.$or.push({ pricePerMonth: priceFilterMonth });
    }

    const properties = await Property.find(filter);

    res.status(200).json({
      success: true,
      status: 200,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add review to a property (with optional roomId)
const addReview = async (req, res, next) => {
  try {
    const { userId, comment, rating, roomId, residencyId } = req.body;

    // Validate
    if (!userId || !comment || !rating) {
      return res.status(400).json({
        success: false,
        message: "userId, comment, and rating are required",
      });
    }

    // Find property
    const property = await Property.findOne({ residencyId });
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // ✅ Check if user already reviewed this property (same residencyId + roomId)
    const alreadyReviewed = property.reviews.find(
      (r) =>
        r.userId === userId &&
        (roomId ? r.roomId === roomId : true) // if roomId given, check with it
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this property/room",
      });
    }

    // Push review
    property.reviews.push({
      userId,
      roomId: roomId || null, // optional
      comment,
      rating,
    });

    // ✅ Update average rating
    const avgRating =
      property.reviews.reduce((sum, r) => sum + r.rating, 0) /
      property.reviews.length;
    property.rating = avgRating.toFixed(1);

    await property.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  addProperty,
  getAllProperties,
  addRoomsToProperty,
  updateRoomInProperty,
  deleteProperty,
  filterProperties,
  addReview,
};
