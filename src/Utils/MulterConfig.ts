import multer from "multer";

export const bufferUploader = multer({ storage: multer.memoryStorage() , limits: {
        fileSize: 1024 * 1024 * 1024,
        fieldSize: 1024 * 1024 * 1024
    }});
