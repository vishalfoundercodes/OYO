const express = require('express');
const route = express.Router();
const { placeOrder,orderHistory } = require('../controller/orderController');
// Route to place an order
route.post('/placeorder', placeOrder);
route.post('/orderHistory', orderHistory);
module.exports = route;

