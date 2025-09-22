// const mongoose = require("mongoose");

// const enumSchema = new mongoose.Schema({
//   category: { type: String, required: true }, // e.g. "propertyType", "roomType", "furnishedType"
//   options: [
//     {
//       label: { type: String, required: true }, // e.g. "Hotel"
//       value: { type: String, required: true }, // e.g. "hotel"
//     },
//   ],
// });

// const EnumModel = mongoose.model("Enums", enumSchema);

// module.exports = EnumModel;

const mongoose = require("mongoose");

const ALLOWED_CATEGORIES = [
  "propertyType",
  "roomType",
  "furnishedType",
  "priceRange",
  "amenities",
  "rating",
];

const enumSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ALLOWED_CATEGORIES, // ✅ Sirf allowed categories
  },
  options: [
    {
      label: { type: String },
      value: { type: String},
      min: { type: Number }, // only for priceRange
      max: { type: Number },
    },
  ],
});

const EnumModel = mongoose.model("Enums", enumSchema);
module.exports = EnumModel;

