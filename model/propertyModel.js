const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Hotel/PG/Apartment name
  type: { type: String, enum: ["hotel", "pg", "apartment"], required: true },

  // Location
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },

  // Images
  mainImage: { type: String }, // URL of main image
  images: [{ type: String }], // All images (gallery)

  // Pricing
  pricePerNight: { type: Number }, // for hotel/PG (per room/bed)
  pricePerMonth: { type: Number }, // for apartments/PG monthly rent
  depositAmount: { type: Number }, // security deposit

  // Rooms / Units
  rooms: [
    {
      roomType: {
        type: String,
        enum: [
          "single",
          "double",
          "triple",
          "suite",
          "1bhk",
          "2bhk",
          "3bhk",
          "shared",
        ],
        required: true,
      },
      furnished: {
        type: String,
        enum: ["furnished", "semi-furnished", "unfurnished"],
        default: "unfurnished",
      },
      occupancy: { type: Number, default: 1 }, // how many people can stay
      price: { type: Number }, // price per night/month for this room
      amenities: [{ type: String }], // e.g., AC, TV, attached bathroom
      availableUnits: { type: Number, default: 0 },
      images: [{ type: String }],
    },
  ],

  // General Amenities
  amenities: [{ type: String }], // e.g., WiFi, Parking, Lift, Gym, Laundry
  rules: [{ type: String }], // e.g., No smoking, No pets

  // Contact
  contactNumber: { type: String },
  email: { type: String },
  website: { type: String },

  // Ratings & Reviews
  rating: { type: Number, default: 0 }, // avg rating
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
      rating: { type: Number },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // Availability
  availableRooms: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },

  // Owner / Host
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdAt: { type: Date, default: Date.now },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
