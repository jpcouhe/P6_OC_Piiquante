const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

/* It's connecting to the MongoDB database. */
exports.clientPromise = mongoose
    .connect(process.env.MONGO_SECURE_URI)
    .then(() => console.log("Connexion à MongoDB réussi !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));
