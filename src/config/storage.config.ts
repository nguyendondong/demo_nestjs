import { diskStorage } from "multer";
import { extname } from "path";
import { BadRequestException } from "@nestjs/common";

const storage = diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "./uploads/images");
    } else if (file.mimetype === "text/csv") {
      cb(null, "./uploads/csv");
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const multerOptions = {
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      const ext = file.originalname.split(".").pop();
      const allowedMimes = ["jpeg", "pjpeg", "png", "jpg"];
      if (!allowedMimes.includes(ext)) {
        req.fileValidationError = "Only image files are allowed!";
        cb(new BadRequestException("Only image files are allowed!"), false);
      }
      cb(null, true);
    } else if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
};
