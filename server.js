require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
const port = 4000;
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
const salt = bcrypt.genSaltSync(10);
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile")
const image = require("./controllers/image");

const db = knex({
    client: "pg",
    connection: {
        host: "postgresql-encircled-62559",
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: "food_app",
    },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ROOT
app.get("/", (req, res) => {
    res.json(database.users);
});

// SIGNING ROUTE
app.post("/signin", (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

// REGISTER ROUTE
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt, salt) });

// PROFILE ROUTE
app.get("/profile/:id", (req, res) => { profile.handleProfile(req, res, db) });

// IMAGE ROUTE
app.put("/image", (req, res) => { image.handleImage(req, res, db) });

// IMAGE API CALL
app.post("/imageurl", (req, res) => { image.handleApiCall(req, res) });

// START THE SERVER
app.listen(process.env.PORT || port, () => {
    console.log(`app is running at port: ${process.env.PORT}`);
});