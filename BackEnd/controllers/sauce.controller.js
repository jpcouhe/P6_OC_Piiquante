const Sauce = require("../database/models/sauce.model");
const fs = require("fs");
const {
    createSauce,
    deleteSauce,
    getSauces,
    getSauce,
    updateSauce,
    updateLikeSauce,
} = require("../queries/sauce.queries");


exports.sauceList = async (req, res) => {
    try {
        const sauces = await getSauces();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(404).json({ error });
    }
};

exports.sauceDetails = async (req, res) => {
    const sauceId = req.params.id;
    try {
        const sauce = await getSauce(sauceId);
        res.status(200).json(sauce);
    } catch (error) {
        res.status(404).json({
            error: error,
        });
    }
};

exports.sauceCreate = async (req, res) => {
    try {
        const sauce = JSON.parse(req.body.sauce);
        await createSauce(sauce, req);
        res.status(201).json({ message: "Object recorded" });
    } catch (error) {
        res.status(400).json({ message: "Bad request!" });
    }
};

exports.sauceDelete = async (req, res) => {
    try {
        const sauceId = req.params.id;
        const sauce = await getSauce(sauceId);
        if (!sauce) {
            throw new Error("Object not found !");
        } else if (sauce.userId !== req.auth.userId) {
            throw new Error("Unauthorized request!");
        } else {
            await deleteSauce(sauce);
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink("images/" + filename, () => {
                res.status(200).json({
                    message: "Deleted!",
                });
            });
        }
    } catch (error) {
        if (error.message === "Unauthorized request!") {
            res.status(401).json({
                error: error.message,
            });
        } else if (error.message === "Object not found !") {
            res.status(404).json({
                error: error.message,
            });
        } else {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

exports.sauceUpdate = async (req, res) => {
    try {
        const sauceId = req.params.id;
        if (req.file) {
            try {
                const sauce = await getSauce(sauceId);
                const filename = sauce.imageUrl.split("/images")[1];
                const newSauce = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: req.protocol + "://" + req.get("host") + "/images/" + req.file.filename,
                };
                const sauceUpdate = await updateSauce(newSauce, sauceId);
                if (sauceUpdate) {
                    fs.unlink("images/" + filename, (error) => {
                        if (error) throw error;
                    });
                } else {
                    throw new Error("Update Failed !");
                }
            } catch (error) {
                throw new Error("Object not found !");
            }
        } else {
            const newSauce = {
                ...req.body,
            };
            try {
                const sauceUpdate = await updateSauce(newSauce, sauceId);
            } catch (error) {
                throw new Error("Object not found !");
            }
        }
        res.status(200).json({ message: "Object modified !" });
    } catch (error) {
       /* Deleting the file from the server. */
        if (req.file) {
            fs.unlink(req.file.path, (error) => {
                if (error) throw error;
            });
        }
        // -------------
        if (error.message === "Object not found !") {
            res.status(404).json({
                error: error.message,
            });
        } else {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

exports.sauceLikes = async (req, res) => {
    try {
        const sauceId = req.params.id;
        const userId = req.body.userId;
        const like = req.body.like;
        const sauce = await getSauce(sauceId);
        /* Checking if the user has already liked or disliked the sauce. */
        const hasLike =
            sauce.usersDisliked.includes(req.body.userId) || sauce.usersLiked.includes(req.body.userId);

        let updateValues;
        let message;

        switch (like) {
            case 1:
                   // It is not possible, for the same user, to put 2 positive likes on the same sauce
                if (sauce.usersLiked.includes(req.body.userId)) {
                    throw new Error("Incorrect value");
                } 
                // Possibility to go from -1 to + 1 if the FrontEnd allows it (not our case)
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    updateValues = {
                        $inc: { likes: +1, dislikes: -1 },
                        $push: { usersLiked: userId },
                        $pull: { usersDisliked: userId },
                    };
                    message = "Positive opinion";
                } else {
                    updateValues = { $inc: { likes: +1 }, $push: { usersLiked: userId } };
                    message = "Positive opinion";
                }
                break;

            case 0:
                if (!hasLike) {
                    throw new Error("Incorrect value");
                }
                if (sauce.usersLiked.includes(req.body.userId)) {
                    updateValues = { $inc: { likes: -1 }, $pull: { usersLiked: userId } };
                    message = "Cancellation positive opinion";
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    updateValues = { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } };
                    message = "Cancellation negative opinion";
                }
                break;

            case -1:
                // It is not possible, for the same user, to put 2 negative likes on the same sauce
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    throw new Error("Incorrect value");
                    // Possibility to go from +1 to -1 if the FrontEnd allows it (not our case)
                } else if (sauce.usersLiked.includes(req.body.userId)) {
                    updateValues = {
                        $inc: { dislikes: +1, likes: -1 },
                        $push: { usersDisliked: userId },
                        $pull: { usersLiked: userId },
                    };
                    message = "Negative opinion";
                } else {
                    updateValues = { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } };
                    message = "Negative opinion";
                }
                break;
        }
        await updateLikeSauce(sauceId, updateValues);
        res.status(200).json({ message });
    } catch (error) {
        res.status(403).json({
            error: error.message,
        });
    }
};
