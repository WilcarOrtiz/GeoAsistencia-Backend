/*const multer = require("multer");
const path = require("path");

// Configuración del almacenamiento temporal
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
 */

// upload.js o config/multer.js
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = upload;
