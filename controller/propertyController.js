// controllers/propertyController.js
const Property = require("../model/propertyModel");

// @desc Add new property
// const addProperty = async (req, res, next) => {
//   try {
//     // Debug logs
//     // console.log("Request headers:", req.headers);
//     // console.log("Request body:", req.body);
//     // console.log("Body type:", typeof req.body);
//     // console.log("Body keys:", Object.keys(req.body || {}));

//     // Check if body exists
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body is empty or not properly parsed",
//         debug: {
//           contentType: req.headers["content-type"],
//           bodyExists: !!req.body,
//           bodyType: typeof req.body,
//         },
//       });
//     }

//     // Destructure all expected fields from the body
//     const {
//       userId,
//       userType,
//       name,
//       type,
//       address,
//       city,
//       state,
//       pincode,
//       coordinates,
//       mainImage,
//       images,
//       pricePerNight,
//       pricePerMonth,
//       depositAmount,
//       rooms,
//       amenities,
//       rules,
//       contactNumber,
//       email,
//       website,
//       rating,
//       reviews,
//       availableRooms,
//       isAvailable,
//     } = req.body;

//     // Validate required fields
//     if (!name || !type || !address || !city || !state) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//         required: ["name", "type", "address", "city", "state"],
//         received: {
//           name: !!name,
//           type: !!type,
//           address: !!address,
//           city: !!city,
//           state: !!state,
//         },
//       });
//     }
//   const lastresidencyId = await Property.findOne({})
//     .sort({ residencyId: -1 })
//     .lean();
//   const nextresidencyId =
//     lastresidencyId && lastresidencyId.residencyId
//       ? lastresidencyId.residencyId + 1
//       : 1;

//     // Build the property object explicitly
//     const propertyData = {
//       userId,
//       userType,
//       residencyId:nextresidencyId,
//       name,
//       type,
//       address,
//       city,
//       state,
//       pincode,
//       coordinates,
//       mainImage,
//       images,
//       pricePerNight,
//       pricePerMonth,
//       depositAmount,
//       rooms,
//       amenities,
//       rules,
//       contactNumber,
//       email,
//       website,
//       rating,
//       reviews,
//       availableRooms,
//       isAvailable,
//     };

//     // Attach owner if logged-in user is available
//     if (req.user) {
//       propertyData.owner = req.user._id;
//     }

   
//     // console.log("Property data to save:", propertyData);

//     const newProperty = new Property(propertyData);
//     const savedProperty = await newProperty.save();

//     res.status(201).json({
//       success: true,
//       message: "Property added successfully",
//       // data: savedProperty,
//       status:200
//     });
//   } catch (err) {
//     console.error("Error adding property:", err);
//     next(err); // pass error to global error handler
//   }
// };
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
      status: 200,
    });
  } catch (err) {
    // console.error("Error adding property:", err);
    next(err); // pass error to global error handler
  }
};


// @desc Get all properties
const getAllProperties = async (req, res, next) => {
  try {
  const properties = await Property.find().populate({
    path: "owner",
    match: { type: 1 }, // only vendor owners
    select: "name email userId type",
  });
// fetch reviewer info

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    // console.error("Error fetching properties:", error);
    next(error); // ✅
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


module.exports = {
  addProperty,
  getAllProperties,
  addRoomsToProperty,
  updateRoomInProperty,
  deleteProperty,
  filterProperties,
};
