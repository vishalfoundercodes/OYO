const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. "privacy", "terms"
  title: { type: String, default: "" },
  html: { type: String, default: "" }, // store raw HTML
  createdBy: { type: String, default: null }, // admin id or name
  updatedBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
});

policySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
