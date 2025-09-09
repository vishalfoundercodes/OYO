// // require("dotenv").config();
// // const express = require("express");
// // const connectDB = require("./db/db.js");
// // const signup = require("./router/authRouter.js");
// // const cors = require("cors");
// // const app = express();
// // const Port=process.env.Port
// // app.use(express.json());
// // app.use(cors());


// // connectDB;

// // app.use("/api", signup);

// // app.listen(Port, () => {
// //   console.log(`server is running on port http://localhost:${Port}`);
// // });

// require("dotenv").config();

// const express = require("express");
// const connectDB = require("./db/db.js");
// const signup = require("./router/authRouter.js");
// const property=require("./router/propertyRoute.js")
// const cors = require("cors");

// const app = express();
// const Port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// // ✅ Connect MongoDB
// connectDB;

// // ✅ Routes
// app.use("/api", signup);
// app.use("/data", property);

// // global error handler
// // Global Error Handler Middleware
// app.use((err, req, res, next) => {
//   console.error("Error stack:", err.stack);

//   // Handle Mongoose validation errors cleanly
//   if (err.name === "ValidationError") {
//     const errors = Object.values(err.errors).map(e => e.message);
//     return res.status(400).json({
//       success: false,
//       message: "Validation error",
//       errors
//     });
//   }

//   // Handle JWT errors
//   if (err.name === "JsonWebTokenError") {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token"
//     });
//   }

//   if (err.name === "TokenExpiredError") {
//     return res.status(401).json({
//       success: false,
//       message: "Token expired"
//     });
//   }

//   // Default fallback
//   res.status(500).json({
//     success: false,
//     message: err.message || "Internal Server Error"
//   });
// });

// app.listen(Port, () => {
//   console.log(`server is running on http://localhost:${Port}`);
// });

require("dotenv").config();

const express = require("express");
const connectDB = require("./db/db.js");
const signup = require("./router/authRouter.js");
const property = require("./router/propertyRoute.js");
const profile = require("./router/profileRouter.js");
const cors = require("cors");

const app = express();
const Port = process.env.PORT || 3000;

// ✅ IMPORTANT: Middleware must be applied BEFORE routes
app.use(cors());

// Handle different content types
app.use(express.json({ limit: "10mb" })); // For application/json
app.use(express.urlencoded({ extended: true })); // For form data

// Custom middleware to handle text/plain as JSON
app.use((req, res, next) => {
  if (req.headers["content-type"] === "text/plain") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        req.body = JSON.parse(data);
        console.log("Parsed text/plain as JSON:", req.body);
      } catch (err) {
        console.log("Failed to parse text/plain as JSON:", err.message);
        req.body = {}; // Set empty object if parsing fails
      }
      next();
    });
  } else {
    next();
  }
});

// ✅ Connect MongoDB
connectDB;

// ✅ Routes
app.use("/api", signup);
app.use("/api", property);
app.use("/api", profile);

// Test route
app.post("/test", (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  res.json({
    received: req.body,
    contentType: req.headers["content-type"],
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});