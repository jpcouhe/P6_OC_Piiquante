const Sauce = require("../database/models/sauce.model");

exports.getSauces = () => {
    return Sauce.find({});
};

exports.getSauce = (sauceId) => {
    return Sauce.findOne({ _id: sauceId });
};

exports.deleteSauce = (sauceId) => {
    return Sauce.deleteOne({ _id: sauceId });
};

exports.createSauce = (sauce, req) => {
    const newSauce = new Sauce({
        ...sauce,
        imageUrl: req.protocol + "://" + req.get("host") + "/images/" + req.file.filename,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    return newSauce.save();
};

exports.updateSauce = (sauce, sauceId) => {
    return Sauce.updateOne({ _id: sauceId }, { ...sauce, _id: sauceId });
};

exports.updateLikeSauce = (sauceId, data) => {
    return Sauce.updateOne({ _id: sauceId }, data);
};
