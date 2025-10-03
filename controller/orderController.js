const OrderData = require("../model/orderModel.js");
const Property = require("../model/propertyModel.js");
const placeOrder = async (req, res) => {
    try {
        const order = new OrderData(req.body);
        await order.save();
        res.status(201).json({ message: "Order placed successfully", status:200 });
    }catch (error) {
        res.status(500).json({ message: "Failed to place order", error: error.message, status:500 });
    }
}

const orderHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    // Get all orders for the user
    const orders = await OrderData.find({ userId });

    const now = new Date();
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Today at 12:00 PM

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const property = await Property.findOne(
          { residencyId: order.residencyId },
          "name mainImage"
        );

        return {
          ...order.toObject(),
          residencyName: property?.name || null,
          residencyImage: property?.mainImage || null,
        };
      })
    );

    // Payment status-based categories
    const pending = enrichedOrders.filter(
      (o) => o.paymentStatus === 0 || o.status === "pending"
    );
    const completed = enrichedOrders.filter(
      (o) => o.paymentStatus === 1 || o.status === "completed"
    );
    const rejected = enrichedOrders.filter(
      (o) => o.paymentStatus === 2 || o.status === "rejected"
    );

    // Time-based categories
    const upcoming = enrichedOrders.filter((o) => {
      const checkIn = new Date(o.checkInDate);
      return (
        checkIn > now ||
        (checkIn.toDateString() === now.toDateString() && now < today)
      );
    });

    const past = enrichedOrders.filter((o) => {
      const checkOut = new Date(o.checkOutDate);
      return checkOut < now;
    });

    const current = enrichedOrders.filter((o) => {
      const checkIn = new Date(o.checkInDate);
      const checkOut = new Date(o.checkOutDate);
      return checkIn <= now && checkOut > now;
    });

    return res.status(200).json({
      status: true,
      msg: "Order history fetched",
      data: {
        paymentStatusWise: {
          pending,
          completed,
          rejected,
        },
        timeWise: {
          upcoming,
          currentStay: current,
          past,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Failed to fetch order history",
      error: error.message,
    });
  }
};


module.exports = { placeOrder, orderHistory };

// const orderHistory = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // 1. Fetch all orders by user
//     const orders = await OrderData.find({ userId });

//     // 2. Add property details to each order
//     const enrichedOrders = await Promise.all(
//       orders.map(async (order) => {
//         const property = await Property.findOne(
//           { residencyId: order.residencyId },
//           "name mainImage"
//         );
//         return {
//           ...order.toObject(),
//           residencyName: property?.name || null,
//           residencyImage: property?.mainImage || null,
//         };
//       })
//     );

//     // 3. Categorize based on paymentStatus or status
//     const pending = enrichedOrders.filter(
//       (o) => o.paymentStatus === 0 || o.status === "pending"
//     );
//     const completed = enrichedOrders.filter(
//       (o) => o.paymentStatus === 1 || o.status === "completed"
//     );
//     const rejected = enrichedOrders.filter(
//       (o) => o.paymentStatus === 2 || o.status === "rejected"
//     );

//     // 4. Send categorized response
//     return res.status(200).json({
//       status: true,
//       msg: "Order history fetched",
//       data: {
//         pending,
//         completed,
//         rejected,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       msg: "Failed to fetch order history",
//       error: error.message,
//     });
//   }
// };


// const orderHistory = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const orders = await OrderData.find({ userId });
//         res.status(200).json({ status:200 ,count:orders.length, orders});
//     }   catch (error) {
//         res.status(500).json({ message: "Failed to fetch order history", error: error.message, status:500 });
//     }
// }