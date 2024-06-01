import multer from "multer";
import cloudinary from "cloudinary";

// Middleware for single file upload
const singleStorage = multer.memoryStorage();
const singleUpload = multer({ storage: singleStorage }).single("file");

// Middleware for multiple file upload
const multipleStorage = multer.memoryStorage();
const multipleUpload = multer({ storage: multipleStorage }).array("files", 5);

// Function used to upload files to cloudinary server
const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });

        stream.end(file.buffer);
    });
};

export { singleUpload, multipleUpload, uploadFile };
