const User = require("../database/models/user.models");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { createUser, findUserAndComparePassword } = require("../queries/user.queries");

exports.signup = async (req, res) => {
    try {
        const body = req.body;
        const user = await createUser(body);
        res.status(201).json({
            message: "utilisateur crée",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const userValid = await findUserAndComparePassword(req.body);
        if (userValid === false) {
            throw new Error("Mot de passe incorrect !");
        } else {
            const jwtToken = jwt.sign({ sub: userValid._id }, process.env.JWT_KEY, { expiresIn: "24h" });
            res.status(200).json({
                userId: userValid._id,
                token: jwtToken,
            });
        }
        //Convention de nommage : Payload(sub : ), secret, Option (méthode d'encodage (par defaut hs256 symétrique : meme secret pour creer et vérifier ), expiration) : clé permet de savoir que c'est notre serveur qui a crée le MAC
    } catch (error) {
        if (error.message === "Mot de passe incorrect !") {
            res.status(401).json({ error: error.message });
        } else if (error.message === "Email non reconnu") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
