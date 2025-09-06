// const mongoose = require('mongoose');
// const signup=mongoose.Schema({
//     name:{type:String,required:true},
//     email:{type:String,required:true},
//     password:{
//         type:Number,
//         required:true
//     }
// })
// const signupModel = mongoose.model("Signup", signup);
// module.exports = signupModel;

const mongoose=require('mongoose')
const signup = mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_type:{
    type:String
  },
  phone:{
    type:String,
    required:true
  },
  DOB:{
    type:String
  },
  currentToken: { type: String, default: null }
});
const signupModel= mongoose.model("Users",signup)
module.exports=signupModel