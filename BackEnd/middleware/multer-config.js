const multer = require("multer");
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
        // const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + "." + extension);
    },
});

module.exports = multer({ storage: storage }).single("image");
