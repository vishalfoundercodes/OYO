const Signup = require("../model/authModel.js");
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Signup.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    if (user.user_type !== "2") {
      return res.status(403).json({ message: "Access denied", status: 403 });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      status: 200,
      profile: {
        userId: user.userId,
        username: user.name,
        email: user.email,
        DOB: user.DOB,
        contact: user.phone,
        userImage: user.userImage,
        gender: user.gender,
        maritalStatus: user.maritalStatus,
        walletBalance: user.walletBalance,
        occupation: user.occupation,
      },
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await Signup.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    if (user.user_type !== "2") {
      return res.status(403).json({ message: "Access denied", status: 403 });
    }

    // ✅ Allowed fields for update (including email)
    const allowedFields = [
      "name",
      "email",
      "DOB",
      "phone",
      "userImage",
      "gender",
      "maritalStatus",
      "occupation",
      "walletBalance",
    ];

    let isUpdated = false;

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined && updates[field] !== user[field]) {
        user[field] = updates[field];
        isUpdated = true;
      }
    });

    if (!isUpdated) {
      return res
        .status(400)
        .json({ message: "No changes detected", status: 400 });
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};

module.exports = { getProfile, updateProfile };