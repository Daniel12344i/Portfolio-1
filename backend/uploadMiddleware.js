import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
  console.log("Created uploads directory:", uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Receiving file:", file.originalname);
    console.log("Saving to directory:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = uniqueSuffix + ext;
    req.uploadedFile = {
      filename: filename,
      path: path.join(uploadsDir, filename),
      relativePath: path.join("uploads", filename),
    };
    cb(null, filename);
  },
});

// File filter function for validation
const fileFilter = (req, file, cb) => {
  console.log("Checking file type:", file.mimetype);
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error(
      "Invalid file type. Only JPEG, PNG, and GIF allowed."
    );
    error.code = "INVALID_FILE_TYPE";
    console.error("Invalid file type rejected:", file.mimetype);
    return cb(error, false);
  }
  cb(null, true);
};

// Create and export multer instance with error handling wrapper
const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const upload = {
  single: (fieldName) => async (c, next) => {
    try {
      await new Promise((resolve, reject) => {
        multerUpload.single(fieldName)(c.req, c.res, (err) => {
          if (err) {
            console.error("File upload error:", err);
            reject(err);
          } else {
            console.log("File upload successful:", c.req.file);
            resolve();
          }
        });
      });

      if (!c.req.file) {
        console.error("No file uploaded");
        return c.json({ error: "File was not provided" }, 400);
      }

      await next();
    } catch (error) {
      console.error("Upload middleware error:", error);
      throw error;
    }
  },
};

console.log("Upload middleware initialized");
console.log("Upload directory configured at:", uploadsDir);
