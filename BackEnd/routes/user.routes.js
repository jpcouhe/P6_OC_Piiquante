const express = require("express");
const { signup, login } = require("../controllers/user.controller");
const routeur = express.Router();

// const userRoutes = require("./user.routes");
// const authRoutes = require("./auth.routes");
routeur.post("/signup", signup);
routeur.post("/login", login);

module.exports = routeur;
