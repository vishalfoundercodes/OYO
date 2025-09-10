const EnumModel = require("../model/EnumModel.js");

// Add new option to category
const addOption = async (req, res) => {
  try {
    const { category, options } = req.body;

    if (!category || !options || !Array.isArray(options)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    let enumDoc = await EnumModel.findOne({ category });
    if (!enumDoc) {
      enumDoc = new EnumModel({ category, options: [] });
    }

    options.forEach((opt) => {
      const exists = enumDoc.options.find((o) => o.value === opt.value);
      if (!exists) {
        enumDoc.options.push({ label: opt.label, value: opt.value });
      }
    });

    await enumDoc.save();

    res
      .status(200)
      .json({ message: "Options added successfully"});
  } catch (error) {
    console.error("Error adding option:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Remove option from category
const removeOption = async (req, res) => {
  try {
    const { category, value } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const enumDoc = await EnumModel.findOne({ category });
    if (!enumDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    // ✅ Case 1: Agar value diya hai -> sirf ek option remove hoga
    if (value) {
      enumDoc.options = enumDoc.options.filter((opt) => opt.value !== value);
      await enumDoc.save();
      return res.status(200).json({
        success: true,
        status: 200,
        message: `Option '${value}' removed successfully from category '${category}'`
      });
    }

    // ✅ Case 2: Agar sirf category diya hai -> poora category delete hoga
    await EnumModel.deleteOne({ category });
    return res.status(200).json({
      success: true,
      message: `Category '${category}' and all its options removed successfully`,
    });
  } catch (error) {
    console.error("Error removing option:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// controller/enumController.js
const getOptions = async (req, res) => {
  try {
    // query params uthao
    const queryKeys = Object.keys(req.query);

    // agar ?null aaya hai ya koi query nahi di -> return all enums
    if (
      queryKeys.length === 0 ||
      (queryKeys.length === 1 && queryKeys[0] === "null")
    ) {
      const allEnums = await EnumModel.find({});
      return res.status(200).json(allEnums);
    }

    // warna pehle query param ka naam hi category hai
    const category = queryKeys[0];
    const enumDoc = await EnumModel.findOne({ category });

    if (!enumDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(enumDoc.options);
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addOption, removeOption, getOptions };