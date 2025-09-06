require("dotenv").config();
const Signup = require("../model/authModel.js");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
const crypto = require("crypto");
const addNewSignup = async (req, res) => {
  try {
    const { name, email, password, user_type , phone, DOB} = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });
    if (!password)
      return res.status(400).json({ message: "Password required" });
    if (!user_type)
      return res.status(400).json({ message: "User type required" });
    if (!phone)
      return res.status(400).json({ message: "Phone required" });

    const existedUser = await Signup.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Find last userId
    const lastUser = await Signup.findOne({}).sort({ userId: -1 }).lean();
    const nextUserId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;

    // ✅ If name is missing, generate a random one
    let finalName = name;
    if (!finalName) {
      const randomSuffix = crypto.randomBytes(3).toString("hex"); // e.g. "a7f9x3"
      finalName = `user_${randomSuffix}`;
    }

    // Create new signup
    const signup = new Signup({
      name:finalName,
      email,
      password,
      userId: nextUserId,
      user_type,
      phone,
      DOB
    });

    const data = await signup.save();

    // ✅ Remove password before sending response
    const { password: _, ...userWithoutPassword } = data.toObject();

    // ✅ Generate token with the saved user's details
    const token = jwt.sign(
      { userId: data.userId, email: data.email },
      jwtSecret || "MY_SECRET_KEY",
      { expiresIn: "1h" }
    );

    // ✅ Save token to DB
    data.currentToken = token;
    await data.save();

    res.status(200).json({
      message: "Signup successful",
      // user: userWithoutPassword,
      user: {
        userId: data.userId,
        email: data.email,
        user_type: data.user_type,
        userName: data.name,
        phone: data.phone,
        DOB:data.DOB
      },
      loginToken: token,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error in register", error });
  }
};


const getLogin = async (req, res) => {
  try {
    const { email, password,user_type } = req.body;

    // Find the user
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Compare passwords (⚠️ please hash in real projects)
    if (password !== user.password) {
      return res
        .status(401)
        .json({ message: "Password is incorrect" });
    }

    if (user_type != user.user_type) {
      return res.status(401).json({ message: "User type is incorrect" });
    }
    // Generate new token
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      jwtSecret || "MY_SECRET_KEY",
      { expiresIn: "1h" }
    );

    // Save the new token to DB (invalidate previous session)
    user.currentToken = token;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user: { userId: user.userId, email: user.email, user_type: user.user_type, userName:user.name, phone:user.phone, DOB:user.DOB },
      loginToken:token,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const authController = async (req, res) => {
  try {
    const { action, name, email, password, user_type, phone, DOB } = req.body;

    if (!action || !["signup", "login"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    if (action === "signup") {
      // ---- SIGNUP LOGIC ----
      if (!email) return res.status(400).json({ message: "Email required" });
      if (!password)
        return res.status(400).json({ message: "Password required" });
      if (!user_type)
        return res.status(400).json({ message: "User type required" });
      if (!phone) return res.status(400).json({ message: "Phone required" });

      const existedUser = await Signup.findOne({ email });
      if (existedUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const lastUser = await Signup.findOne({}).sort({ userId: -1 }).lean();
      const nextUserId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;

      let finalName = name;
      if (!finalName) {
        const randomSuffix = crypto.randomBytes(3).toString("hex");
        finalName = `user_${randomSuffix}`;
      }

      const signup = new Signup({
        name: finalName,
        email,
        password,
        userId: nextUserId,
        user_type,
        phone,
        DOB,
      });

      const data = await signup.save();
      const token = jwt.sign(
        { userId: data.userId, email: data.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      data.currentToken = token;
      await data.save();

      return res.status(200).json({
        message: "Signup successful",
        user: {
          userId: data.userId,
          email: data.email,
          user_type: data.user_type,
          userName: data.name,
          phone: data.phone,
          DOB: data.DOB,
        },
        loginToken: token,
      });
    }

    if (action === "login") {
      // ---- LOGIN LOGIC ----
      const user = await Signup.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist" });

      if (password !== user.password) {
        return res.status(401).json({ message: "Password is incorrect" });
      }

      if (user_type !== user.user_type) {
        return res.status(401).json({ message: "User type is incorrect" });
      }

      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      user.currentToken = token;
      await user.save();

      return res.status(200).json({
        message: "Login successful",
        user: {
          userId: user.userId,
          email: user.email,
          user_type: user.user_type,
          userName: user.name,
          phone: user.phone,
          DOB: user.DOB,
        },
        loginToken: token,
      });
    }
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// module.exports = { authController };


module.exports = { addNewSignup, getLogin, authController };
