import multer from "multer";

// Middleware for single file upload
const singleStorage = multer.memoryStorage();
const singleUpload = multer({ storage: singleStorage }).single("file");

// Middleware for multiple file upload
const multipleStorage = multer.memoryStorage();
const multipleUpload = multer({ storage: multipleStorage }).array("files", 5);

export { singleUpload, multipleUpload };
