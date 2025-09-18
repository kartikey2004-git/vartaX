import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// create a new cloudinary storage for multer to upload chat images to cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat-images", // folder name where images will be stored in cloudinary

    // formats allowed for storing images
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],

    // resize image if larger than 800x600
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  } as any,
});

// multer middleware to handle image upload
export const upload = multer({
  storage, // use cloudinary storage defined above

  // set file size limit to 5MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  // only allow image files
  fileFilter: (req, file, cb) => {
    if (!file) {
      cb(null, true);
    } else if (file.mimetype.startsWith("/image/")) {
      cb(null, true);
    } else {
      cb(new Error("only images allowed"));
    }
  },
});
