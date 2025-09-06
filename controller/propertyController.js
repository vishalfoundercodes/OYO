// controllers/propertyController.js
const Property = require("../model/propertyModel");

// @desc Add new property
// const addProperty = async (req, res, next) => {
//   try {
//     const propertyData = req.body;

//     // attach owner from logged-in user (if token middleware sets req.user)
//     if (req.user) {
//       propertyData.owner = req.user._id;
//     }

//     const newProperty = new Property(propertyData);
//     const savedProperty = await newProperty.save();

//     res.status(201).json({
//       success: true,
//       message: "Property added successfully",
//       data: savedProperty,
//     });
//   } catch (error) {
//     console.error("Error adding property:", error);
//     next(error); // ✅ Pass to global error handler
//   }
// };

const addProperty = async (req, res, next) => {
  try {
    // Debug logs
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("Body type:", typeof req.body);
    console.log("Body keys:", Object.keys(req.body || {}));

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
      rooms,
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

    // Build the property object explicitly
    const propertyData = {
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
      rooms,
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

    console.log("Property data to save:", propertyData);

    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      data: savedProperty,
    });
  } catch (err) {
    console.error("Error adding property:", err);
    next(err); // pass error to global error handler
  }
};



// @desc Get all properties
const getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email userId") // fetch owner info
      .populate("reviews.userId", "name email"); // fetch reviewer info

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    next(error); // ✅
  }
};

// @desc Get property by ID
const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate("owner", "name email userId")
      .populate("reviews.userId", "name email");

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error("Error fetching property:", error);
    next(error); // ✅
  }
};

// @desc Update property
const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    next(error); // ✅
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
    console.error("Error deleting property:", error);
    next(error); // ✅
  }
};

module.exports = {
  addProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
