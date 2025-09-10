// const express = require("express");
// const route = express.route();
// const {
//   addOrUpdatePolicy,
//   getPolicyJson,
//   getPolicyHtml,
// } = require("../controller/policyController");
// const authMiddleware = require("../middleware/authmiddleware.js"); // your auth middleware

// // Admin-only create/update
// route.post("/policy", authMiddleware, addOrUpdatePolicy); // body: { key, title, html }

// // Get policies (json)
// // GET /api/policy?key=privacy  OR GET /api/policy  (all)
// route.get("/policy", getPolicyJson);

// // Raw HTML endpoint (for viewer/iframe) - public
// // GET /api/policy/html/privacy
// route.get("/policy/html/:key", getPolicyHtml);

// module.exports = route;

const express = require("express");
const route = express.Router();
const auth = require("../middleware/authmiddleware.js");
const {
      addOrUpdatePolicy,
  getPolicyJson,
  getPolicyHtml,
} = require("../controller/policyController.js");

// Sirf admin add/update kar sake
route.post("/policy", auth, async (req, res, next) => {
  if (req.user.user_type !== "0") {
    // 0 = admin
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  addOrUpdatePolicy(req, res, next);
});

// Public ke liye
route.get("/policy", getPolicyJson);

module.exports = route;
