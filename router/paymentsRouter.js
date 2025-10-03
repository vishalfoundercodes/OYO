// const express = require("express");
// const Cashfree = require("cashfree-pg");
// const router = express.Router();
// const { clientId, clientSecret, env } = require("../config/cashfree");

// Cashfree.XClientId = clientId;
// Cashfree.XClientSecret = clientSecret;
// Cashfree.XEnvironment = env;

// // ✅ Create Payment Order
// router.post("/payment/create-order", async (req, res) => {
//   const { userId, amount } = req.body;

//   const orderId = "ORDER_" + Date.now();

//   const payload = {
//     order_id: orderId,
//     order_amount: amount,
//     order_currency: "INR",
//     customer_details: {
//       customer_id: userId,
//       customer_email: "test@example.com", // test email
//       customer_phone: "9999999999", // test phone
//     },
//     order_note: "Wallet Recharge",
//     order_meta: {
//       return_url: `https://yourfrontend.com/success?order_id={order_id}`,
//       notify_url: "https://yourbackend.com/api/payment/webhook",
//     },
//   };

//   try {
//     const result = await Cashfree.PG.orders.create(payload);
//     res.json({
//       success: true,
//       orderId,
//       paymentLink: result.data.payment_link,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.response?.data || err.message,
//     });
//   }
// });

// // ✅ Check Payment Status
// router.get("/payment/status/:orderId", async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const result = await Cashfree.PG.orders.get(orderId);
//     res.json({
//       success: true,
//       status: result.data.order_status,
//       paymentDetails: result.data,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.response?.data || err.message,
//     });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   initiatePayment,
//   verifyPayment,
//   paymentWebhook,
//   getWalletBalance,
// } = require("../controller/paymentController.js");

// router.post("/initiate", initiatePayment);
// router.post("/verify", verifyPayment);
// router.post("/webhook", paymentWebhook);
// router.get("/balance/:userId", getWalletBalance);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  verifyPayment,
  paymentWebhook,
} = require("../controller/paymentController");

// Routes
router.post("/payment/initiate", initiatePayment);
router.get("/payment/verify", verifyPayment);
router.post("/payment/webhook", paymentWebhook);

module.exports = router;
