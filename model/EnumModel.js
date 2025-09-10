const mongoose = require("mongoose");

const enumSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g. "propertyType", "roomType", "furnishedType"
  options: [
    {
      label: { type: String, required: true }, // e.g. "Hotel"
      value: { type: String, required: true }, // e.g. "hotel"
    },
  ],
});

const EnumModel = mongoose.model("Enums", enumSchema);

module.exports = EnumModel;
