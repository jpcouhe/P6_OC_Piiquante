// Session ou authentification avec token JWT (interessant pour gros traffic)

const jwt = require("jsonwebtoken");
const { findUserPerId } = require("../queries/user.queries");
const dotenv = require("dotenv").config();

//Package cookieParser pour utiliser la méthode req.cookie.jwt

// Pour la GET : pas de body donc ca ne vérifie rien .....
// Verifie seulement si il existe un token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        const userId = decodedToken.sub;
        // Création d'une clé auth pour pouvoir le Delete
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw new Error({ message: "unauthorized request" });
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: "Autorisation required",
        });
    }
};



