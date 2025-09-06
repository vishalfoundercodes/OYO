const mongoose = require("mongoose");
require("dotenv").config();
const MongooseUrl = process.env.MongoDbURL;


const connectDB = async () => {
    try {
      await mongoose.connect(MongooseUrl);
      console.log("MongoDB Connected Successfully ✅");
    } catch (error) {
      console.error("MongoDB Connection Error ❌:", error);
      process.exit(1); // Exit process if connection fails
    }
  };
  module.exports = connectDB();