const multer = require("multer");

const MINE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MINE_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(" ").join("_");
      const ext = MINE_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    },
  });

  module.exports = multer({ storage }).single("image");