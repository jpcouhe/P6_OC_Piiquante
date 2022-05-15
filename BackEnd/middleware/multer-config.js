const multer = require("multer");
const uuid = require("uuid");
// recupere la data qui est sous forme de multipart/form-data

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, uuid.v4() + "." + extension);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES.hasOwnProperty(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Invalid mime type"));
        }
    },
});

module.exports = upload.single("image");
