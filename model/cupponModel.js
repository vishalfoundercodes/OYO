// const mongoose = require("mongoose");

// const couponSchema = new mongoose.Schema(
//   {
//     code: { type: String, required: true, unique: true },
//     type: { type: String, enum: ["flat", "percent"], required: true },
//     value: { type: Number, required: true }, // discount amount or percentage

//     isPublic: { type: Boolean, default: false }, // 🔥 public/private
//     maxUses: { type: Number, default: 1 }, // 🔥 for public coupon
//     usedBy: [{ type: String }], // 🔥 userId list

//     assignedTo: { type: String, default: null }, // 🔒 private coupon

//     createdBy: { type: String, required: true },
//     used: { type: Boolean, default: false }, // for private only
//     usedAt: { type: Date, default: null },
//     expiresAt: { type: Date, required: true },
//   },
//   { timestamps: true }
// );

// const Coupon = mongoose.model("Coupon", couponSchema);
// module.exports = Coupon;

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },

    couponType: {
      type: String,
      enum: ["private", "limited", "evergreen"],
      required: true,
    },

    type: { type: String, enum: ["percentage", "fixed"] },
    value: { type: Number, required: true },

    minOrderAmount: { type: Number, default: 0 },

    createdBy: {
      type: String,
      ref: "User",
      required: true,
    },
    createdByType: { type: Number, enum: [0, 1], required: true },

    // PRIVATE
    assignedTo: {
      type: String,
      ref: "User",
      default: null,
    },

    // LIMITED
    maxUses: { type: Number, default: null },
    usedBy: [{ type: String, ref: "User" }],

    // COMMON
    expiresAt: { type: Date, default: null },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);



