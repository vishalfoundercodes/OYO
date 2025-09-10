// const mongoose = require("mongoose");

// const propertySchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   userType: { type: String },
//   residencyId: {
//     type: Number,
//     unique: true,
//   },
//   name: { type: String, required: true }, // Hotel/PG/Apartment name
//   type: { type: String, enum: ["hotel", "pg", "apartment"], required: true },

//   // Location
//   address: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   pincode: { type: String, required: true },
//   coordinates: {
//     lat: { type: Number },
//     lng: { type: Number },
//   },

//   // Images
//   mainImage: { type: String, required: true }, // URL of main image
//   images: [{ type: String }], // All images (gallery)

//   // Pricing
//   pricePerNight: { type: Number }, // for hotel/PG (per room/bed)
//   pricePerMonth: { type: Number }, // for apartments/PG monthly rent
//   depositAmount: { type: Number }, // security deposit

//   // Rooms / Units
//   rooms: [
//     {
//       roomId: { type: Number, required: true }, // ✅ unique per property
//       roomType: {
//         type: String,
//         enum: [
//           "single",
//           "double",
//           "triple",
//           "suite",
//           "1bhk",
//           "2bhk",
//           "3bhk",
//           "shared",
//         ],
//         required: true,
//       },
//       furnished: {
//         type: String,
//         enum: ["furnished", "semi-furnished", "unfurnished"],
//         default: "unfurnished",
//       },
//       occupancy: { type: Number, default: 1 },
//       price: { type: Number },
//       amenities: [{ type: String }],
//       availableUnits: { type: Number, default: 0 },
//       images: [{ type: String }],
//     },
//   ],

//   // General Amenities
//   amenities: [{ type: String }], // e.g., WiFi, Parking, Lift, Gym, Laundry
//   rules: [{ type: String }], // e.g., No smoking, No pets

//   // Contact
//   contactNumber: { type: String },
//   email: { type: String },
//   website: { type: String },

//   // Ratings & Reviews
//   rating: { type: Number, default: 0 }, // avg rating

//   reviews: [
//     {
//       userId: { type: String, required: true },
//       roomId: { type: Number }, // ✅ optional
//       comment: { type: String, required: true },
//       rating: { type: Number, min: 1, max: 5, required: true },
//       createdAt: { type: Date, default: Date.now },
//     },
//   ],

//   description:{ type: String },
//   // Availability
//   availableRooms: { type: Number, default: 0 },
//   isAvailable: { type: Boolean, default: true },

//   // Owner / Host
//   owner: { type: String },

//   createdAt: { type: Date, default: Date.now },
// });

// const Property = mongoose.model("Property", propertySchema);

// module.exports = Property;

const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userType: { type: String },
  residencyId: { type: Number, unique: true },
  name: { type: String, required: true }, // Hotel/PG/Apartment name

  // type: hotel, pg, apartment (dynamic)
  type: { type: String, required: true },

  // Location
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },

  // Images
  mainImage: { type: String, required: true },
  images: [{ type: String }],

  // Pricing
  pricePerNight: { type: Number },
  pricePerMonth: { type: Number },
  depositAmount: { type: Number },

  // Rooms / Units
  rooms: [
    {
      roomId: { type: Number, required: true },
      roomType: { type: String, required: true }, // dynamic
      furnished: { type: String, default: "unfurnished" }, // dynamic
      occupancy: { type: Number, default: 1 },
      price: { type: Number },
      amenities: [{ type: String }],
      availableUnits: { type: Number, default: 0 },
      images: [{ type: String }],
    },
  ],

  amenities: [{ type: String }],
  rules: [{ type: String }],

  // Contact
  contactNumber: { type: String },
  email: { type: String },
  website: { type: String },

  // Ratings & Reviews
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: { type: String, required: true },
      roomId: { type: Number },
      comment: { type: String, required: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  description: { type: String },
  availableRooms: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  owner: { type: String },

  createdAt: { type: Date, default: Date.now },
});

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
