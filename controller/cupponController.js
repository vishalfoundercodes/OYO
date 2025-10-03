const Coupon = require("../model/cupponModel.js");
const { generateUniqueCouponCode } = require("../utilities/generateCoupon.js");

const createCoupon = async (req, res) => {
  try {
    let {
      code,
      couponType, // private | limited | evergreen
      type, // flat | percentage
      value,
      minOrderAmount,
      assignedTo,
      createdBy,
      createdByType, // 0 = superadmin, 1 = admin
      expiryInMinutes,
      maxUses,
      description,
    } = req.body;

    // Required fields common
    const requiredFields = {
      couponType,
      type,
      value,
      createdBy,
      createdByType,
      description,
    };
    let missingFields = Object.keys(requiredFields).filter(
      (key) => requiredFields[key] === undefined || requiredFields[key] === ""
    );

    // Extra rules
    if (couponType === "private" && !assignedTo)
      missingFields.push("assignedTo");
    if (couponType === "limited" && !maxUses) missingFields.push("maxUses");
    if (couponType !== "evergreen" && !expiryInMinutes)
      missingFields.push("expiryInMinutes");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: false,
        msg: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Auto generate code
    if (!code) {
      code = await generateUniqueCouponCode();
    } else {
      const exists = await Coupon.findOne({ code });
      if (exists) {
        return res
          .status(400)
          .json({ status: false, msg: "Coupon code already exists" });
      }
    }

    // Expiry logic
    let expiresAt = null;
    if (expiryInMinutes && couponType !== "evergreen") {
      expiresAt = new Date(Date.now() + expiryInMinutes * 60000);
    }

    const couponData = {
      code,
      description,
      couponType,
      type,
      value,
      minOrderAmount,
      createdBy,
      createdByType,
      assignedTo: couponType === "private" ? assignedTo : null,
      expiresAt,
      maxUses: couponType === "limited" ? maxUses : null,
    };

    const coupon = new Coupon(couponData);
    await coupon.save();

    res
      .status(201)
      .json({ status: true, msg: "Coupon created", coupon: coupon.code });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Error creating coupon",
      error: error.message,
    });
  }
};


const applyCoupon = async (req, res) => {
  try {
    const { code, userId, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code });

    if (!coupon)
      return res.status(404).json({ status: false, msg: "Invalid coupon" });

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ status: false, msg: "Coupon expired" });
    }

    // Already used check
    if (coupon.usedBy.includes(userId)) {
      return res
        .status(400)
        .json({ status: false, msg: "You already used this coupon" });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        status: false,
        msg: `Minimum order ${coupon.minOrderAmount} required`,
      });
    }

    // Private coupon check
    if (coupon.couponType === "private") {
      if (!coupon.assignedTo || coupon.assignedTo !== userId) {
        return res
          .status(403)
          .json({ status: false, msg: "Coupon not for you" });
      }
      if (coupon.used) {
        return res
          .status(400)
          .json({ status: false, msg: "Coupon already used" });
      }
    }

    // Limited coupon check
    if (coupon.couponType === "limited") {
      if (coupon.maxUses && coupon.usedBy.length >= coupon.maxUses) {
        return res
          .status(400)
          .json({ status: false, msg: "Coupon usage limit reached" });
      }
    }

    // ✅ Mark used
    coupon.usedBy.push(userId);
    if (coupon.couponType === "private") coupon.used = true;
    await coupon.save();

    // Discount calculation
    let discountAmount =
      coupon.type === "flat"
        ? coupon.value
        : (orderAmount * coupon.value) / 100;

    res.status(200).json({
      status: true,
      msg: "Coupon applied",
      discountType: coupon.type,
      discountValue: coupon.value,
      discountAmount,
      finalAmount: orderAmount - discountAmount,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      msg: "Failed to apply coupon",
      error: err.message,
    });
  }
};


const markCouponAsUsed = async (code) => {
  try {
    await Coupon.findOneAndUpdate({ code }, { used: true, usedAt: new Date() });
  } catch (error) {
    console.log("Failed to mark coupon as used:", error.message);
  }
};


module.exports = { applyCoupon, createCoupon, markCouponAsUsed };