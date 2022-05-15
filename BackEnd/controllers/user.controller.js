const User = require("../database/models/user.models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { createUser, findUserAndComparePassword } = require("../queries/user.queries");

exports.signup = async (req, res) => {
    try {
        const body = req.body;
        const user = await createUser(body);
        res.status(201).json({
            message: "User creates",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const userValid = await findUserAndComparePassword(req.body);
        if (userValid === false) {
            throw new Error("Incorrect Password !");
        } else {
            const jwtToken = jwt.sign({ sub: userValid._id }, process.env.JWT_KEY, { expiresIn: "24h" });
            res.status(200).json({
                userId: userValid._id,
                token: jwtToken,
            });
        }
    } catch (error) {
        if (error.message === "Incorrect Password !") {
            res.status(401).json({ error: error.message });
        } else if (error.message === "Email not recognized") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
