const multer = require("multer");

// Configure multer to store the file in memory as a buffer
const storage = multer.memoryStorage();

// We can also add file type filters here, but let's keep it simple for now
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

module.exports = upload;
