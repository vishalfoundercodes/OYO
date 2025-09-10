// const Banner =require("../model/bannerModel.js");
// const addBanners = async (req, res, next) => {
//   try {
//     const { title, images } = req.body; // images = array of {url, alt}

//     if (!images || images.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one image is required",
//       });
//     }

//     const banner = new Banner({
//       title,
//       images,
//     });

//     await banner.save();

//     res.status(200).json({
//       success: true,
//       status: 200,
//       message: "Banner added successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getBanners = async (req, res, next) => {
//   try {
//     const banners = await Banner.find({ isActive: true }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json({
//       success: true,
//       status: 200,
//       message: "Banners fetched successfully",
//       count: banners.length,
//       data: banners,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// const getBannerByTitle = async (req, res, next) => {
//   try {
//     const { title } = req.params;

//     const banners = await Banner.find({
//       title: { $regex: title, $options: "i" }, // partial + case-insensitive
//       isActive: true,
//     });

//     if (!banners || banners.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No banners found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       status: 200,
//       message: "Banners fetched successfully",
//       count: banners.length,
//       data: banners,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//  const updateBanner = async (req, res, next) => {
//    try {
//      const { id } = req.params;
//      const { title, images, isActive } = req.body;

//      const banner = await Banner.findById(id);

//      if (!banner) {
//        return res.status(404).json({
//          success: false,
//          message: "Banner not found",
//        });
//      }

//      // update fields if provided
//      if (title !== undefined) banner.title = title;
//      if (images !== undefined) banner.images = images; // full replace, can be array of {url, alt}
//      if (isActive !== undefined) banner.isActive = isActive;

//      await banner.save();

//      res.status(200).json({
//        success: true,
//        message: "Banner updated successfully",
//        data: banner,
//      });
//    } catch (error) {
//      next(error);
//    }
//  };

//  const deleteBanner = async (req, res, next) => {
//    try {
//      const { id } = req.params;

//      const banner = await Banner.findByIdAndDelete(id);

//      if (!banner) {
//        return res.status(404).json({
//          success: false,
//          message: "Banner not found",
//        });
//      }

//      res.status(200).json({
//        success: true,
//        message: "Banner deleted successfully",
//      });
//    } catch (error) {
//      next(error);
//    }
//  };

// module.exports = {
//   addBanners,
//   getBanners,
//   getBannerByTitle,
//   updateBanner,
//   deleteBanner,
// };

const Banner = require("../model/bannerModel.js");

// Add new banner with custom titleId + imageIds
const addBanners = async (req, res, next) => {
  try {
    const { title, images } = req.body; // images = array of {url, alt}

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Find last banner for titleId
    const lastBanner = await Banner.findOne({}).sort({ titleId: -1 }).lean();
    const nextTitleId =
      lastBanner && lastBanner.titleId ? lastBanner.titleId + 1 : 1;

    // Assign imageIds
    const imagesWithId = [];
    let lastImageId = 0;

    for (const img of images) {
      lastImageId++;
      imagesWithId.push({
        imageId: lastImageId,
        url: img.url,
        alt: img.alt || "",
      });
    }

    const banner = new Banner({
      titleId: nextTitleId,
      title,
      images: imagesWithId,
    });

    await banner.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Banner added successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete a single image by imageId inside a specific title
// Delete image OR full banner by titleId
const deleteImageFromBanner = async (req, res, next) => {
  try {
    const { titleId, imageId } = req.params;

    // Agar imageId diya hi nahi ya invalid hai → pura banner delete
    if (!imageId || imageId === "null" || imageId === "undefined") {
      const banner = await Banner.findOneAndDelete({
        titleId: Number(titleId),
      });

      if (!banner) {
        return res
          .status(404)
          .json({ success: false, message: "Banner not found" });
      }

      return res.status(200).json({
        success: true,
        status:200,
        message: "Banner section deleted successfully",
      });
    }

    // Otherwise → ek single image delete karni hai
    const banner = await Banner.findOne({ titleId: Number(titleId) });

    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    banner.images = banner.images.filter(
      (img) => img.imageId !== Number(imageId)
    );
    await banner.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Image deleted successfully from banner",
    });
  } catch (error) {
    next(error);
  }
};


const getBannerByTitle = async (req, res, next) => {
  try {
    const { title } = req.params;

    const banners = await Banner.find({
      title: { $regex: title, $options: "i" }, // case-insensitive search
      isActive: true,
    }).lean();

    if (!banners || banners.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No banners found",
      });
    }

    // Flatten images array
    const images = banners.flatMap((b) =>
      b.images.map((img) => ({
        imageId: img.imageId || null,
        url: img.url,
      }))
    );

    res.status(200).json({
      status: 200,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};



const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, images, isActive } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // update fields if provided
    if (title !== undefined) banner.title = title;
    if (images !== undefined) banner.images = images; // full replace, can be array of {url, alt}
    if (isActive !== undefined) banner.isActive = isActive;

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Banners fetched successfully",
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  addBanners,
  deleteImageFromBanner,
  updateBanner,
  getBannerByTitle,
  getBanners,
};