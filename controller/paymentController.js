// const cashfree = require("../config/cashfree");
// const Signup = require("../model/authModel.js");

// // Initialize Payment
// const initiatePayment = async (req, res) => {
//   try {
//     const { userId, amount } = req.body;

//     if (!userId || !amount) {
//       return res.status(400).json({
//         status: false,
//         msg: "User ID and amount are required",
//       });
//     }

//     // Find user
//     const user = await Signup.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         msg: "User not found",
//       });
//     }

//     // Generate unique order ID
//     const orderId = `ORDER_${userId}_${Date.now()}`;

//     // Create payment request
//     const paymentData = {
//       orderId: orderId,
//       orderAmount: amount,
//       orderCurrency: "INR",
//       orderNote: "Wallet recharge",
//       customerDetails: {
//         customerId: userId.toString(),
//         customerName: user.name,
//         customerEmail: user.email,
//         customerPhone: user.phone,
//       },
//       returnUrl: `${process.env.BASE_URL}/api/payment/verify`, // Your success callback URL
//       notifyUrl: `${process.env.BASE_URL}/api/payment/webhook`, // Your webhook URL
//     };

//     // Generate payment link
//     const paymentLink = await cashfree.PGCreateOrder(paymentData);

//     // Save payment details temporarily (you might want to create a Payment model)
//     // For now, we'll just return the payment link

//     res.status(200).json({
//       status: true,
//       msg: "Payment initiated successfully",
//       data: {
//         paymentLink: paymentLink.paymentLink,
//         orderId: orderId,
//         amount: amount,
//       },
//     });
//   } catch (error) {
//     console.error("Payment initiation error:", error);
//     res.status(500).json({
//       status: false,
//       msg: "Error initiating payment",
//       error: error.message,
//     });
//   }
// };

// // Verify Payment and Update Wallet
// const verifyPayment = async (req, res) => {
//   try {
//     const { orderId, orderAmount, referenceId, txStatus, txMsg, txTime } =
//       req.body;

//     if (!orderId) {
//       return res.status(400).json({
//         status: false,
//         msg: "Order ID is required",
//       });
//     }

//     // Extract userId from orderId (ORDER_userId_timestamp)
//     const userId = orderId.split("_")[1];

//     // Find user
//     const user = await Signup.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         msg: "User not found",
//       });
//     }

//     // Verify payment status with CashFree
//     const orderDetails = await cashfree.PGOrderFetchPayments(orderId);

//     if (
//       orderDetails &&
//       orderDetails.payments &&
//       orderDetails.payments.length > 0
//     ) {
//       const payment = orderDetails.payments[0];

//       if (payment.paymentStatus === "SUCCESS") {
//         // Update wallet balance
//         user.walletBalance =
//           (user.walletBalance || 0) + parseFloat(orderAmount);
//         await user.save();

//         // You might want to create a transaction record here
//         // await Transaction.create({
//         //   userId: userId,
//         //   orderId: orderId,
//         //   amount: orderAmount,
//         //   type: "CREDIT",
//         //   status: "SUCCESS",
//         //   referenceId: referenceId,
//         //   timestamp: new Date()
//         // });

//         return res.status(200).json({
//           status: true,
//           msg: "Payment successful and wallet updated",
//           data: {
//             newBalance: user.walletBalance,
//             amountAdded: orderAmount,
//           },
//         });
//       } else {
//         return res.status(400).json({
//           status: false,
//           msg: "Payment failed",
//           error: payment.paymentMessage || "Payment not successful",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         status: false,
//         msg: "Payment verification failed",
//       });
//     }
//   } catch (error) {
//     console.error("Payment verification error:", error);
//     res.status(500).json({
//       status: false,
//       msg: "Error verifying payment",
//       error: error.message,
//     });
//   }
// };

// // Webhook for payment notifications (recommended)
// const paymentWebhook = async (req, res) => {
//   try {
//     const { data, eventTime, type } = req.body;

//     if (type === "TRANSACTION_SUCCESS") {
//       const { orderId, orderAmount, referenceId } = data;

//       // Extract userId from orderId
//       const userId = orderId.split("_")[1];

//       // Find user and update wallet
//       const user = await Signup.findOne({ userId });
//       if (user) {
//         user.walletBalance =
//           (user.walletBalance || 0) + parseFloat(orderAmount);
//         await user.save();

//         // Create transaction record
//         // await Transaction.create({ ... });
//       }
//     }

//     res.status(200).json({ status: "OK" });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     res.status(500).json({ status: "ERROR" });
//   }
// };

// // Get Wallet Balance
// const getWalletBalance = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await Signup.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         msg: "User not found",
//       });
//     }

//     res.status(200).json({
//       status: true,
//       msg: "Wallet balance fetched successfully",
//       data: {
//         walletBalance: user.walletBalance || 0,
//       },
//     });
//   } catch (error) {
//     console.error("Wallet balance error:", error);
//     res.status(500).json({
//       status: false,
//       msg: "Error fetching wallet balance",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   initiatePayment,
//   verifyPayment,
//   paymentWebhook,
//   getWalletBalance,
// };

const { Cashfree } = require("cashfree-pg");

// Cashfree client setup
const cashfree = new Cashfree({
  clientId: process.env.CASHFREE_CLIENT_ID,
  clientSecret: process.env.CASHFREE_CLIENT_SECRET,
  environment: "SANDBOX", // use "PRODUCTION" for live
});

// ✅ Initiate Payment
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, userId, name, email, phone } = req.body;

    // Unique order ID
    const orderId = "ORDER_" + userId + "_" + Date.now();

    // Create order
    const response = await cashfree.orders.createOrder({
      orderId,
      orderAmount: amount,
      orderCurrency: "INR",
      orderNote: "Wallet recharge",
      customerDetails: {
        customerId: String(userId),
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      },
      returnUrl: "http://localhost:5000/api/payment/verify", // Change in PROD
      notifyUrl: "http://localhost:5000/api/payment/webhook",
    });

    console.log("Cashfree Order Response:", response);

    res.status(200).json({
      success: true,
      orderId,
      data: response,
    });
  } catch (error) {
    console.error(
      "Payment initiation error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
};

// ✅ Verify Payment (Cashfree redirects here)
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.query;

    const response = await cashfree.orders.getOrder(orderId);

    console.log("Verify Response:", response);

    res.status(200).json({
      success: true,
      orderId,
      data: response,
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.response?.data || error.message,
    });
  }
};

// ✅ Webhook (Cashfree calls this)
exports.paymentWebhook = async (req, res) => {
  try {
    console.log("Webhook Data:", req.body);

    // TODO: Save webhook data to DB

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Webhook error" });
  }
};
