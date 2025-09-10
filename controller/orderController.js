const OrderData = require("../model/orderModel.js");

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
        const orders = await OrderData.find({ userId });
        res.status(200).json({ status:200 ,count:orders.length, orders});
    }   catch (error) {
        res.status(500).json({ message: "Failed to fetch order history", error: error.message, status:500 });
    }
}

module.exports = { placeOrder, orderHistory };