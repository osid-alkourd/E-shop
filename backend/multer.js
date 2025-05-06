const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // make sure this folder exists
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
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
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