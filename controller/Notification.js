// const Coupon = require("../model/cupponModel.js");

// const getUserCoupons = async (req, res) => {
//   try {
//     const { userId } = req.body; // or req.query depending on your route

//     if (!userId) {
//       return res
//         .status(400)
//         .json({ status: false, msg: "User ID is required" });
//     }

//     const now = new Date();

//     // Fetch all coupons that are not expired
//     const coupons = await Coupon.find({
//       $or: [
//         { expiresAt: null }, // evergreen
//         { expiresAt: { $gt: now } }, // valid expiry
//       ],
//     });

//     // Filter coupons based on rules
//     const availableCoupons = coupons.filter((coupon) => {
//       // Exclude already used
//       if (coupon.usedBy.includes(userId)) return false;
//       if (coupon.couponType === "private" && coupon.used) return false;

//       // Private → only for that user
//       if (coupon.couponType === "private") {
//         return coupon.assignedTo?.toString() === userId.toString();
//       }

//       // Limited → check usage limit
//       if (coupon.couponType === "limited") {
//         if (coupon.maxUses && coupon.usedBy.length >= coupon.maxUses) {
//           return false;
//         }
//       }

//       // Evergreen → always available
//       return true;
//     });

//     res.status(200).json({
//       status: true,
//       msg: "Available coupons fetched",
//       coupons: availableCoupons,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       msg: "Error fetching coupons",
//       error: error.message,
//     });
//   }
// };

// module.exports = { getUserCoupons };

// const Coupon = require("../model/cupponModel.js");

// const getUserCoupons = async (req, res) => {
//   try {
//     const { userId } = req.body; // or req.query depending on your route

//     if (!userId) {
//       return res
//         .status(400)
//         .json({ status: false, msg: "User ID is required" });
//     }

//     const now = new Date();

//     // Fetch all coupons that are not expired
//     const coupons = await Coupon.find({
//       $or: [
//         { expiresAt: null }, // evergreen
//         { expiresAt: { $gt: now } }, // valid expiry
//       ],
//     });

//     // Filter coupons based on rules
//     const availableCoupons = coupons.filter((coupon) => {
//       // Exclude already used
//       if (coupon.usedBy.includes(userId)) return false;
//       if (coupon.couponType === "private" && coupon.used) return false;

//       // Private → only for that user
//       if (coupon.couponType === "private") {
//         return coupon.assignedTo?.toString() === userId.toString();
//       }

//       // Limited → check usage limit
//       if (coupon.couponType === "limited") {
//         if (coupon.maxUses && coupon.usedBy.length >= coupon.maxUses) {
//           return false;
//         }
//       }

//       // Evergreen → always available
//       return true;
//     });

//     // Organize coupons by type
//     const categorizedCoupons = {
//       evergreen: {
//         type: "evergreen",
//         options: availableCoupons
//           .filter((coupon) => coupon.couponType === "evergreen")
//           .map((coupon) => ({
//             label: coupon.couponName || "Evergreen Coupon",
//             description: coupon.description,
//             cupponCode: coupon.code,
//             type: coupon.type,
//             minOrderAmount: coupon.minOrderAmount,
//             discount: coupon.value,
//             expiresAt: coupon.expiresAt,
//             // Add other relevant coupon fields as needed
//           })),
//       },
//       private: {
//         type: "private",
//         options: availableCoupons
//           .filter((coupon) => coupon.couponType === "private")
//           .map((coupon) => ({
//             label: coupon.couponName || "Private Coupon",
//             description: coupon.description,
//             cupponCode: coupon.code,
//             type: coupon.type,
//             minOrderAmount: coupon.minOrderAmount,
//             discount: coupon.value,
//             expiresAt: coupon.expiresAt,
//             // Add other relevant coupon fields as needed
//           })),
//       },
//       limited: {
//         type: "limited",
//         options: availableCoupons
//           .filter((coupon) => coupon.couponType === "limited")
//           .map((coupon) => ({
//             label: coupon.couponName || "Limited Coupon",
//             description: coupon.description,
//             cupponCode: coupon.code,
//             type: coupon.type,
//             minOrderAmount: coupon.minOrderAmount,
//             discount: coupon.value,
//             expiresAt: coupon.expiresAt,
//             remainingUses: coupon.maxUses - coupon.usedBy.length,
//             // Add other relevant coupon fields as needed
//           })),
//       },
//     };

//     // Remove empty categories
//     Object.keys(categorizedCoupons).forEach((key) => {
//       if (categorizedCoupons[key].options.length === 0) {
//         delete categorizedCoupons[key];
//       }
//     });

//     // Calculate total coupon count
//     const totalCouponsCount = Object.values(categorizedCoupons).reduce(
//       (total, category) => total + category.options.length,
//       0
//     );

//     res.status(200).json({
//       status: true,
//       msg: `Data fetched successfully`,
//       coupons:totalCouponsCount,
//       data: {
//         coupon: categorizedCoupons, // Wrapping under "coupon" object
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       msg: "Error fetching coupons",
//       error: error.message,
//     });
//   }
// };

// module.exports = { getUserCoupons };

const Coupon = require("../model/cupponModel.js");
const Order = require("../model/orderModel.js");

const getUserCoupons = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, msg: "User ID is required" });
    }

    const now = new Date();

    // ===== Coupons Logic =====
    const coupons = await Coupon.find({
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    });

    const availableCoupons = coupons.filter((coupon) => {
      if (coupon.usedBy.includes(userId)) return false;
      if (coupon.couponType === "private" && coupon.used) return false;

      if (coupon.couponType === "private") {
        return coupon.assignedTo?.toString() === userId.toString();
      }

      if (coupon.couponType === "limited") {
        if (coupon.maxUses && coupon.usedBy.length >= coupon.maxUses) {
          return false;
        }
      }

      return true;
    });

    const categorizedCoupons = {
      evergreen: {
        type: "evergreen",
        options: availableCoupons
          .filter((c) => c.couponType === "evergreen")
          .map((c) => ({
            label: c.couponName || "Evergreen Coupon",
            description: c.description,
            cupponCode: c.code,
            type: c.type,
            minOrderAmount: c.minOrderAmount,
            discount: c.value,
            expiresAt: c.expiresAt,
          })),
      },
      private: {
        type: "private",
        options: availableCoupons
          .filter((c) => c.couponType === "private")
          .map((c) => ({
            label: c.couponName || "Private Coupon",
            description: c.description,
            cupponCode: c.code,
            type: c.type,
            minOrderAmount: c.minOrderAmount,
            discount: c.value,
            expiresAt: c.expiresAt,
          })),
      },
      limited: {
        type: "limited",
        options: availableCoupons
          .filter((c) => c.couponType === "limited")
          .map((c) => ({
            label: c.couponName || "Limited Coupon",
            description: c.description,
            cupponCode: c.code,
            type: c.type,
            minOrderAmount: c.minOrderAmount,
            discount: c.value,
            expiresAt: c.expiresAt,
            remainingUses: c.maxUses - c.usedBy.length,
          })),
      },
    };

    //empty ko remove krne ke liye
    // Object.keys(categorizedCoupons).forEach((key) => {
    //   if (categorizedCoupons[key].options.length === 0) {
    //     delete categorizedCoupons[key];
    //   }
    // });

    const totalCouponsCount = Object.values(categorizedCoupons).reduce(
      (total, cat) => total + cat.options.length,
      0
    );

    // ===== Booking Confirmed Logic =====
    const orders = await Order.find({ userId }).sort({ checkInDate: 1 });

    const upcoming = orders.filter((o) => new Date(o.checkInDate) > now);

    const bookingConfirmed = {
      type: "bookingConfirmed",
      options: upcoming.map((o) => ({
        orderId: o.orderId,
        residencyId: o.residencyId,
        residencyName: o.residencyName,
        residencyImage: o.residencyImage,
        checkInDate: o.checkInDate,
        checkOutDate: o.checkOutDate,
        totalAmount: o.totalAmount,
        finalAmount: o.finalAmount,
        cupponCode: o.cupponCode,
        paymentStatus: o.paymentStatus,
        bookingFor: o.bookingFor,
        nog: o.nog,
        isChildren: o.isChildren,
        childrenNumber: o.childrenNumber,
        createdAt: o.createdAt,
      })),
    };

    const bookingConfirmedCount = bookingConfirmed.options.length;

    // ===== Final Response =====
    res.status(200).json({
      status: true,
      msg: "Data fetched successfully",
      coupons: totalCouponsCount,
      bookingConfirmed: bookingConfirmedCount,
      data: {
        coupon: categorizedCoupons,
        bookingConfirmed,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error fetching notifications",
      error: error.message,
    });
  }
};

module.exports = { getUserCoupons };


