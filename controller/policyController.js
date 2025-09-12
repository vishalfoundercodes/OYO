const Policy = require("../model/policyModel.js");
const sanitizeHtml = require("sanitize-html");

// sanitize options — tweak as needed
const SANITIZE_OPTS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "h1",
    "h2",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ]),
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    "*": ["class", "id", "style"],
  },
  // disallow scripts, inline event handlers like onclick etc.
};

const addOrUpdatePolicy = async (req, res, next) => {
  try {
    // ensure admin (use your auth middleware normally)
    if (!req.user || req.user.user_type !== "0") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { key, title, html } = req.body;
    if (!key || typeof html !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "key and html required" });
    }

    // sanitize HTML before saving
    const cleanHtml = sanitizeHtml(html, SANITIZE_OPTS);

    // upsert: if exists update, else create
    const existing = await Policy.findOne({ key });
    if (existing) {
      existing.title = title || existing.title;
      existing.html = cleanHtml;
      existing.updatedBy = req.user.userId || req.user._id || "admin";
      existing.version = (existing.version || 1) + 1;
      await existing.save();
      return res
        .status(200)
        .json({ success: true, message: "Policy updated", data: existing });
    }

    const created = await Policy.create({
      key,
      title: title || key,
      html: cleanHtml,
      createdBy: req.user.userId || req.user._id || "admin",
    });

    return res
      .status(201)
      .json({ success: true, message: "Policy created" });
  } catch (err) {
    next(err);
  }
};

const getPolicyJson = async (req, res, next) => {
  try {
    let key = req.query.key || req.params.key;

    if (key === undefined || key === null || key === "null" || key === "") {
      // agar key null ya empty ho to sari policies bhej do
      const all = await Policy.find({}).select("-__v");
      return res.status(200).json(all);
    }

    // number mapping
    const map = {
      0: "help-center",
      1: "privacy",
      2: "return",
      3: "terms",
    };

    // agar key number me mila to usko string key me convert karo
    if (map[key] !== undefined) {
      key = map[key];
    }

    const p = await Policy.findOne({ key }).select("-__v");
    if (!p)
      return res.status(404).json({ success: false, message: "Not found" });

return res.status(200).json({
  success: true,
  status: 200,
  data: p,
});
  } catch (err) {
    next(err);
  }
};


// Optional: return raw HTML with content-type text/html — useful for iframe or direct HTML viewer
const getPolicyHtml = async (req, res, next) => {
  try {
    const key = req.params.key;
    if (!key) return res.status(400).send("Bad Request");

    const p = await Policy.findOne({ key });
    if (!p) return res.status(404).send("Not found");

    // set safe headers for embedding if needed
    // res.set("Content-Security-Policy", "default-src 'self'"); // configure as needed

    res.type("html").send(p.html);
  } catch (err) {
    next(err);
  }
};

module.exports = { addOrUpdatePolicy, getPolicyJson, getPolicyHtml };
