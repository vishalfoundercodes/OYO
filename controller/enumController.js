// const EnumModel = require("../model/EnumModel.js");

// // Add new option to category
// const addOption = async (req, res) => {
//   try {
//     const { category, options } = req.body;

//     if (!category || !options || !Array.isArray(options)) {
//       return res.status(400).json({ message: "Invalid payload" });
//     }

//     let enumDoc = await EnumModel.findOne({ category });
//     if (!enumDoc) {
//       enumDoc = new EnumModel({ category, options: [] });
//     }

//     options.forEach((opt) => {
//       const exists = enumDoc.options.find((o) => o.value === opt.value);
//       if (!exists) {
//         enumDoc.options.push({ label: opt.label, value: opt.value });
//       }
//     });

//     await enumDoc.save();

//     res
//       .status(200)
//       .json({ message: "Options added successfully"});
//   } catch (error) {
//     console.error("Error adding option:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// // Remove option from category
// const removeOption = async (req, res) => {
//   try {
//     const { category, value } = req.body;

//     if (!category) {
//       return res.status(400).json({ message: "Category is required" });
//     }

//     const enumDoc = await EnumModel.findOne({ category });
//     if (!enumDoc) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     // ✅ Case 1: Agar value diya hai -> sirf ek option remove hoga
//     if (value) {
//       enumDoc.options = enumDoc.options.filter((opt) => opt.value !== value);
//       await enumDoc.save();
//       return res.status(200).json({
//         success: true,
//         status: 200,
//         message: `Option '${value}' removed successfully from category '${category}'`
//       });
//     }

//     // ✅ Case 2: Agar sirf category diya hai -> poora category delete hoga
//     await EnumModel.deleteOne({ category });
//     return res.status(200).json({
//       success: true,
//       message: `Category '${category}' and all its options removed successfully`,
//     });
//   } catch (error) {
//     console.error("Error removing option:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// // controller/enumController.js
// // controller/enumController.js
// const getOptions = async (req, res) => {
//   try {
//     const queryKeys = Object.keys(req.query);

//     // ✅ Case 1: Agar koi query nahi di -> return all enums in required format
//     if (
//       queryKeys.length === 0 ||
//       (queryKeys.length === 1 && queryKeys[0] === "null")
//     ) {
//       const allEnums = await EnumModel.find({});
//       let formattedData = {};

//       allEnums.forEach((doc) => {
//         formattedData[doc.category] = {
//           type: doc.category,
//           options: doc.options,
//         };
//       });

//       return res.status(200).json({
//         status: true,
//         msg: "fetched",
//         data: formattedData,
//       });
//     }

//     // ✅ Case 2: Agar specific category query param diya hai
//     const category = queryKeys[0];
//     const enumDoc = await EnumModel.findOne({ category });

//     if (!enumDoc) {
//       return res.status(404).json({
//         status: false,
//         msg: "Category not found",
//         data: {},
//       });
//     }

//     return res.status(200).json({
//       status: 200,
//       msg: "Data fetched",
//       data: {
//         [category]: {
//           type: category,
//           options: enumDoc.options,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching options:", error);
//     res.status(500).json({
//       status: false,
//       msg: "Internal Server Error",
//       data: {},
//     });
//   }
// };


// module.exports = { addOption, removeOption, getOptions };

// const EnumModel = require("../model/EnumModel.js");

// const ALLOWED_CATEGORIES = [
//   "propertyType",
//   "roomType",
//   "furnishedType",
//   "priceRange",
//   "amenities",
// ];

// // ✅ Add Option
// const addOption = async (req, res) => {
//   try {
//     const { category, options } = req.body;

//     if (!ALLOWED_CATEGORIES.includes(category)) {
//       return res.status(400).json({
//         status: false,
//         message: `Invalid category. Allowed categories: ${ALLOWED_CATEGORIES.join(
//           ", "
//         )}`,
//       });
//     }

//     if (!options || !Array.isArray(options)) {
//       return res.status(400).json({ message: "Options must be an array" });
//     }

//     let enumDoc = await EnumModel.findOne({ category });
//     if (!enumDoc) {
//       enumDoc = new EnumModel({ category, options: [] });
//     }

//     options.forEach((opt) => {
//       const exists = enumDoc.options.find((o) => o.value === opt.value);
//       if (!exists) {
//         enumDoc.options.push({ label: opt.label, value: opt.value });
//       }
//     });

//     await enumDoc.save();
//     return res.status(200).json({
//       status: 200,
//       message: "Options added successfully",
//     });
//   } catch (error) {
//     // console.error("Error adding option:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Fixed mapping for UI keys
// const categoryMap = {
//   propertyType: "Property Type",
//   roomType: "Room Type",
//   furnishedType: "Furnished Type",
//   priceRange: "Price Range",
//   amenities: "Amenities",
//   facilities: "Facilities",
// };
// // get all options
// const getOptions = async (req, res) => {
//   try {
//     const allEnums = await EnumModel.find({});
//     let formattedData = {};

//     allEnums.forEach((doc) => {
//       const mappedKey = categoryMap[doc.category] || doc.category; // UI name
//       formattedData[mappedKey] = {
//         type: doc.category, // original type
//         options: doc.options,
//       };
//     });

//     return res.status(200).json({
//       status: true,
//       msg: "fetched",
//       data: formattedData,
//     });
//   } catch (error) {
//     console.error("Error fetching options:", error);
//     res.status(500).json({
//       status: false,
//       msg: "Internal Server Error",
//       data: {},
//     });
//   }
// };

// // ✅ Remove Option
// const removeOption = async (req, res) => {
//   try {
//     const { category, value } = req.body;

//     if (!ALLOWED_CATEGORIES.includes(category)) {
//       return res.status(400).json({
//         status: false,
//         message: `Invalid category. Allowed categories: ${ALLOWED_CATEGORIES.join(
//           ", "
//         )}`,
//       });
//     }

//     const enumDoc = await EnumModel.findOne({ category });
//     if (!enumDoc) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     if (value) {
//       enumDoc.options = enumDoc.options.filter((opt) => opt.value !== value);
//       await enumDoc.save();
//       return res.status(200).json({
//         status: true,
//         message: `Option '${value}' removed successfully from '${category}'`,
//       });
//     }

//     return res.status(400).json({
//       status: false,
//       message: "Value is required to remove a single option",
//     });
//   } catch (error) {
//     console.error("Error removing option:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { addOption, removeOption, getOptions };


const EnumModel = require("../model/EnumModel.js");

const ALLOWED_CATEGORIES = [
  "propertyType",
  "roomType",
  "furnishedType",
  "priceRange",
  "amenities",
  "rating"
];

// ✅ Add Option
const addOption = async (req, res) => {
  try {
    const { category, options } = req.body;

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        status: false,
        message: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`,
      });
    }

    if (!options || !Array.isArray(options)) {
      return res.status(400).json({ message: "Options must be an array" });
    }

    let enumDoc = await EnumModel.findOne({ category });
    if (!enumDoc) {
      enumDoc = new EnumModel({ category, options: [] });
    }

    options.forEach((opt) => {
      if (category === "priceRange") {
        // ✅ For Price Range (min/max)
        if (
          typeof opt.min !== "number" ||
          typeof opt.max !== "number" ||
          opt.min >= opt.max
        ) {
          return; // ignore invalid ranges
        }
        enumDoc.options.push({ min: opt.min, max: opt.max });
      } else {
        // ✅ For normal categories
        const exists = enumDoc.options.find((o) => o.value === opt.value);
        if (!exists) {
          enumDoc.options.push({ label: opt.label, value: opt.value });
        }
      }
    });

    await enumDoc.save();
    return res.status(200).json({
      status: 200,
      message: "Options added successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error",error });
  }
};

// Fixed mapping for UI keys
const categoryMap = {
  propertyType: "Property Type",
  roomType: "Room Type",
  furnishedType: "Furnished Type",
  priceRange: "Price Range",
  amenities: "Amenities",
  rating: "Rating",
};

// ✅ Get Options
const getOptions = async (req, res) => {
  try {
    const allEnums = await EnumModel.find({});
    let formattedData = {};

    allEnums.forEach((doc) => {
      const mappedKey = categoryMap[doc.category] || doc.category;

      if (doc.category === "priceRange" && doc.options.length > 0) {
        // 👇 Sirf priceRange ko object banaya hai
        const firstOption = doc.options[0]; // मान लो ek hi hoga
        formattedData[mappedKey] = {
          type: doc.category,
          range: {
            min: firstOption.min,
            max: firstOption.max,
          },
        };
      } else {
        formattedData[mappedKey] = {
          type: doc.category,
          options: doc.options,
        };
      }
    });

    return res.status(200).json({
      status: true,
      msg: "fetched",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      data: {},
    });
  }
};


// ✅ Remove Option
const removeOption = async (req, res) => {
  try {
    const { category, value, id } = req.body;

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        status: false,
        message: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`,
      });
    }

    const enumDoc = await EnumModel.findOne({ category });
    if (!enumDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category === "priceRange" && id) {
      // ✅ remove by _id for priceRange
      enumDoc.options = enumDoc.options.filter(
        (opt) => opt._id.toString() !== id
      );
    } else if (value) {
      // ✅ normal case
      enumDoc.options = enumDoc.options.filter((opt) => opt.value !== value);
    } else {
      return res.status(400).json({
        status: false,
        message: "Value or ID is required to remove option",
      });
    }

    await enumDoc.save();
    return res.status(200).json({
      status: true,
      message: `Option removed successfully from '${category}'`,
    });
  } catch (error) {
    console.error("Error removing option:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addOption, removeOption, getOptions };

