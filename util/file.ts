import multer, { FileFilterCallback } from "multer";

import { getUUIDV1 } from "./uuid";

export const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.includes("image")) {
            cb(null, "public/images");
        } else if (file.mimetype.includes("pdf")) {
            cb(null, "public/pdfs");
        } else {
            cb(null, "public/files");
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${getUUIDV1()}-${file.originalname}`);
    },
});

export const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const allowedMimeTypes = [
    // "audio/aac",
    // "audio/midi",
    // "audio/x-midi",
    // "audio/mpeg",
    // "audio/ogg",
    // "audio/wav",
    // "audio/webm",
    // "audio/3gpp",
    // "audio/3gpp2",
    // "video/x-msvideo",
    "video/mp4",
    "video/mpeg",
    // "video/ogg",
    // "video/webm",
    // "video/mp2t",
    // "video/3gpp",
    // "video/3gpp2",
    // "image/apng",
    // "image/avif",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    // "image/tiff",
    "image/vnd.microsoft.icon",
    "image/webp",
    "application/pdf",
    "text/plain",
    "text/css",
    "text/csv",
    "text/html",
    "text/javascript",
    "application/json",
    "application/ld+json",
    "application/xml",
    "application/xhtml+xml"
];