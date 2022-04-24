const Sauce = require("../database/models/sauce.model");
const fs = require("fs");
const {
    createSauce,
    deleteSauce,
    getSauces,
    getSauce,
    updateSauce,
    likeSauce,
    dislikeSauce,
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
        // Verifie après le FrontEnd que le questionnaire est bien rempli
        if (
            !sauce.name ||
            !sauce.manufacturer ||
            !sauce.description ||
            !sauce.mainPepper ||
            !sauce.heat ||
            !req.file
        ) {
            return res.status(400).send(new Error("Bad request!"));
        } else {
            await createSauce(sauce, req);
            res.status(201).json({ message: "Objet enregistré" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.sauceDelete = async (req, res) => {
    try {
        const sauceId = req.params.id;
        const sauce = await deleteSauce(sauceId);
        if (!sauce) {
            throw new Error("No such Thing!");
        }
        if (sauce.userId !== req.auth.userId) {
            throw new Error("Unauthorized request!");
        }
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink("images/" + filename, () => {
            res.status(200).json({
                message: "Deleted!",
            });
        });
    } catch (error) {
        if (error.message === "Unauthorized request!") {
            res.status(401).json({
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
    // Si la requete envoi un fichier image alors l'imageUrl devient notre image sinon pas de changement et ensuite on fait updateOne
    try {
        const sauceId = req.params.id;

        if (req.file) {
            const sauce = await getSauce(sauceId);
            const filename = sauce.imageUrl.split("/images")[1];
            fs.unlink("images/" + filename, (error) => {
                if (error) throw error;
            });
        }

        const newSauce = req.file
            ? {
                  ...JSON.parse(req.body.sauce),
                  imageUrl: req.protocol + "://" + req.get("host") + "/images/" + req.file.filename,
              }
            : { ...req.body };

        if (
            !newSauce.name ||
            !newSauce.manufacturer ||
            !newSauce.description ||
            !newSauce.mainPepper ||
            !newSauce.heat
        ) {
            return res.status(400).send(new Error("Bad request!"));
        }
        await updateSauce(newSauce, sauceId);

        res.status(200).json({ message: "Objet modifié" });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

exports.sauceLikes = async (req, res) => {
    try {
        const sauceId = req.params.id;
        const userId = req.body.userId;
        const like = req.body.like;
        const sauce = await getSauce(sauceId);

        switch (like) {
            case 1:
                await likeSauce(sauceId, userId, 1);
                res.status(200).json({ message: "Avis positif" });
                break;

            case 0:
                if (sauce.usersLiked.includes(req.body.userId)) {
                    await likeSauce(sauceId, userId, 0);
                    res.status(200).json({ message: "Annulation avis positif" });
                    break;
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    await dislikeSauce(sauceId, userId, 0);
                    res.status(200).json({ message: "Annulation avis négatif" });
                }
                break;

            case -1:
                await dislikeSauce(sauceId, userId, -1);
                res.status(200).json({ message: "Avis négatif" });
                break;

            default:
                break;
        }
    } catch (error) {
        res.status(404).json({
            error: error,
        });
    }
};
