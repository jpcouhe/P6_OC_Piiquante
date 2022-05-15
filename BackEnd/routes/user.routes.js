const express = require("express");
const { signup, login } = require("../controllers/user.controller");

/* Creating a new router object. */
const routeur = express.Router();

routeur.post("/signup", signup);
routeur.post("/login", login);

module.exports = routeur;
