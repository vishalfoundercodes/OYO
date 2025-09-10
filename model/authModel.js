// const mongoose=require('mongoose')
// const signup = mongoose.Schema({
//   userId: {
//     type: Number,
//     unique: true,
//   },
//   name: {
//     type: String
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   user_type:{
//     type:String
//   },
//   phone:{
//     type:String,
//     required:true
//   },
//   DOB:{
//     type:String
//   },
//   currentToken: { type: String, default: null }
// });
// const signupModel= mongoose.model("Users",signup)
// module.exports=signupModel

const mongoose = require("mongoose");

const signup = mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  DOB: {
    type: String,
  },
  userImage: {
    type: String, // store image URL or file path
    default: null,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Other",
  },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widowed"],
    default: "Single",
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  occupation: {
    type: String,
    default: null,
  },
  currentToken: { type: String, default: null },
});


const signupModel = mongoose.model("Users", signup);
module.exports = signupModel;
