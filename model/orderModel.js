const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  residencyId: {
    type: Number,
    required: true,
  },
  roomId: { type: Number,default: null }, // null for full property booking
  nor: { type: Number, default: 1 }, // number of rooms
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  nog: { type: Number, default: 1 }, // number of guests
  bookingFor: { type: String, required: true }, // self/family/friends
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  cupponCode: { type: String, default: null },
  paymentMethod: {
    type: Number, // 1=cash free, 2=paytm,
    required: true,
  },
  orderId: { type: String, required: true, unique: true },
  paymentStatus: {
    type: Number, // 0=pending, 1=completed, 2=failed
    required: true,
  },
  isChildren:{
    type:Boolean,
    default:false
  },
  childrenNumber:{
    type:Number,
    default:0
  }
});

const OrderData=mongoose.model("OrderData", orderSchema);
module.exports = OrderData;