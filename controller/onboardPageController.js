const OnboardPage = require("../model/onboardPageModel.js");

const addOnboardPage = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    // Basic validations
    if (!title)
      return res.status(400).json({ message: "Title required", status: 400 });
    if (!description)
      return res
        .status(400)
        .json({ message: "Description required", status: 400 });
    if (!imageUrl)
      return res
        .status(400)
        .json({ message: "Image URL required", status: 400 });

    // Get last pageId
    const lastPage = await OnboardPage.findOne({})
      .sort({ pageId: -1 })
      .select("pageId");

    const nextPageId = lastPage?.pageId ? lastPage.pageId + 1 : 1;

    // Prevent duplicate title
    const existingPage = await OnboardPage.findOne({ title });
    if (existingPage) {
      return res
        .status(409)
        .json({ message: "Page with this title already exists", status: 409 });
    }

    // Create new page
    const newOnboardPage = new OnboardPage({
      title,
      description,
      imageUrl,
      pageId: nextPageId,
    });

    const savedPage = await newOnboardPage.save();

    return res.status(201).json({
      message: "Onboard page added successfully",
      status: 200
    });
  } catch (error) {
    console.error("Error adding onboard page:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};

const getOnboardPages = async (req, res) => {
  try {
    const pages = await OnboardPage.find().sort({ createdAt: -1 });

    if (pages.length === 0) {
      return res.status(404).json({
        message: "No onboard pages found",

        status: 404,
      });
    } else {
      return res.status(200).json({
        message: "Onboard pages retrieved successfully",
        data: pages,
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error: ", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};

const removeOnboardPage = async (req, res) => {
  try {
    const { pageId } = req.body;
    if (!pageId)
      return res.status(400).json({ message: "pageId required", status: 400 });

    const page = await OnboardPage.findOneAndDelete({ pageId: Number(pageId) });
    if (!page)
      return res
        .status(404)
        .json({ message: "Onboard page not found", status: 404 });

    return res
      .status(200)
      .json({ message: "Onboard page removed successfully", status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};


module.exports = { addOnboardPage, getOnboardPages, removeOnboardPage };
