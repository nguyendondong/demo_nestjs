import { diskStorage } from "multer";

export const storage = diskStorage({
  destination: "uploads/csv",
  filename: (_request, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file: Express.Multer.File) {
  return `${Date.now()}-${file.originalname}`;
}
