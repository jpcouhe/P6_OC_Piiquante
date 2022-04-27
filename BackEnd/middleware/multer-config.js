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

module.exports = multer({ storage: storage }).single("image");
