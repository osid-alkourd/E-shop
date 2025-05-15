const multer = require("multer");
const path = require("path");
const fs = require("fs");

const baseUploadDir = path.join(__dirname, "uploads");

// Ensure base uploads folder exists

if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir);
}

// Map request paths to folder names
const routeToFolderMap = {
  "/api/v2/users": "users",
  "/api/v2/shops": "shops",
  "/api/v2/products": "products",
  // Add more as needed
};

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const originalUrl = req.originalUrl || "";
    let folderName = null;
    if (originalUrl.startsWith("/api/v2/user")) {
      folderName = "users";
    } else if (originalUrl.startsWith("/api/v2/shop")) {
      folderName = "shops";
    } else if (originalUrl.startsWith("/api/v2/product")) {
      folderName = "products";
    }

    if (!folderName) {
      return cb(new Error("Invalid upload route"), false);
    }

    const targetDir = path.join(baseUploadDir, folderName);
    // Create the subfolder if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = path
      .parse(file.originalname)
      .name.replace(/\s+/g, "_"); // gets name without extension
    const ext = path.extname(file.originalname).toLowerCase(); // gets the extension like .jpg
    cb(null, originalName + "-" + uniqueSuffix + ext);
  },
});

// File filter to allow images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = { upload };

// you can replace the module.exports = { upload: multer({ storage: storage })}; with following
// module.exports = {
//     upload: multer({ storage: storage })
//   };
// When you import it somewhere else: , you import like this const { upload } = require('./middleware/multer');

// const fileFilter = (req,res,cb) => {
//   if (!file) {
//     return cb(new Error('Avatar image is required'), false);
//   }
//   cb(null, true);
// }
