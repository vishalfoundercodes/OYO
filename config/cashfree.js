// // config/cashfree.js
// module.exports = {
//   env: "TEST",
//   clientId: process.env.CASHFREE_CLIENT_ID,
//   clientSecret: process.env.CASHFREE_CLIENT_SECRET,
// };

const { Cashfree } = require("cashfree-pg");

// Client setup
const cashfree = new Cashfree({
  clientId: process.env.CASHFREE_CLIENT_ID,
  clientSecret: process.env.CASHFREE_CLIENT_SECRET,
  environment: "SANDBOX", // ya "PRODUCTION"
});

module.exports = cashfree;

