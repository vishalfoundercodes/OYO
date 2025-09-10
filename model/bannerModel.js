// const mongoose = require("mongoose");

// const bannerSchema = new mongoose.Schema(
//   {
//     title: { type: String }, // optional: banner ka naam/heading
//     images: [
//       {
//         url: { type: String, required: true }, // image ka link
//         alt: { type: String }, // optional alt text for SEO
//       },
//     ],
//     isActive: { type: Boolean, default: true }, // active/inactive
//   },
//   { timestamps: true }
// );

// const Banner= mongoose.model("Banner", bannerSchema);
// module.exports = Banner;

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageId: { type: Number, required: true }, // custom auto-increment id for each image
  url: { type: String, required: true },
  alt: { type: String },
});

const bannerSchema = new mongoose.Schema(
  {
    titleId: { type: Number, unique: true }, // custom id for each title
    title: { type: String, required: true },
    images: [imageSchema], // multiple images inside title
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
