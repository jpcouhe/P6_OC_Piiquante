const path = require("path");
const dotenv = require("dotenv").config();
const helmet = require("helmet");

/* Connection to the database */
const { clientPromise } = require("./database");

/* It's importing the routes. */
const saucesRoutes = require("./routes/sauce.routes");
const userRoutes = require("./routes/user.routes");

/* It's creating an instance of the express application. */
const express = require("express");
const app = express();

if (process.env.NODE_ENV === "development") {
    const morgan = require("morgan");
    const morganBody = require("morgan-body");
    /* It's a middleware that logs all requests, including the body, to the console. */
    morganBody(app);
    app.use(morgan("combined"));
}

/* It's a middleware that parses incoming requests with JSON payloads. */
app.use(express.json());

/* It's a middleware that allows you to make requests from a different domain name than your API. */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

/* It's a middleware that serves static files. */
app.use("/images", express.static(path.join(__dirname, "images")));

/* It's a middleware that sets HTTP headers to help protect your app from some well-known web
vulnerabilities by setting HTTP headers appropriately. */
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

/* It's a middleware that allows you to use the routes. */
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
