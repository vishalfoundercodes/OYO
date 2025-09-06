require("dotenv").config();
const jwt = require("jsonwebtoken");
const Signup = require("../model/authModel.js");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "MY_SECRET_KEY"
    );

    // Check if token matches the latest one in DB
    const user = await Signup.findOne({ userId: decoded.userId });
    if (!user || user.currentToken !== token) {
      return res
        .status(401)
        .json({ message: "Session expired, please login again" });
    }

    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
