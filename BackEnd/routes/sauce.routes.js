const express = require("express");
const {
    sauceList,
    sauceDetails,
    sauceCreate,
    sauceDelete,
    sauceUpdate,
    sauceLikes,
} = require("../controllers/sauce.controller");

const routeur = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

routeur.get("/", auth, sauceList);
routeur.get("/:id", auth, sauceDetails);
routeur.post("/", auth, multer, sauceCreate);
routeur.delete("/:id", auth, sauceDelete);
routeur.put("/:id", auth, multer, sauceUpdate);
routeur.post("/:id/like", auth, sauceLikes);
module.exports = routeur;
