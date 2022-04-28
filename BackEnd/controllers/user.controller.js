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
        res.status(500).json({ error });
    }
};

exports.login = async (req, res) => {
    try {
        const userValid = await findUserAndComparePassword(req.body);
        if (userValid === false) {
            throw new Error("Mot de passe incorrect !");
        }
        res.status(200).json({
            userId: userValid._id,
            token: jwt.sign({ userId: userValid._id }, process.env.JWT_KEY, { expiresIn: "24h" }),
        });
    } catch (error) {
        if (error.message === "Mot de passe incorrect !") {
            res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error });
    }
};
