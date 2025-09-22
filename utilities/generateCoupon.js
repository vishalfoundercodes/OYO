const Coupon = require("../model/cupponModel.js");

const generateUniqueCouponCode = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const getRandom = (str, len) =>
    Array.from(
      { length: len },
      () => str[Math.floor(Math.random() * str.length)]
    ).join("");

  let unique = false;
  let code = "";

  while (!unique) {
    code = getRandom(chars, 3) + getRandom(nums, 3); // e.g., ABC123
    const exists = await Coupon.findOne({ code });
    if (!exists) unique = true;
  }

  return code;
};

module.exports = { generateUniqueCouponCode };
