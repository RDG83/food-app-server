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

const db = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
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
app.put("/image", (req, res) => {
    const { id } = req.body;
    db.select("*")
        .from("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => {
            res.json(entries[0]);
        }).catch(err => {
            res.status(400).json('unable to find entries');
        })
});

// START THE SERVER
app.listen(port, () => {
    console.log("app is running at port: ", port);
});
