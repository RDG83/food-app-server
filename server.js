require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
const port = 4000;
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
const salt = bcrypt.genSaltSync(10);
const register = require("./controllers/register");

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
app.post("/signin", (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(response => {
            const isValid = bcrypt.compareSync(req.body.password, response[0].hash)
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
});

// REGISTER ROUTE
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt, salt) });




// PROFILE ROUTE
app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    db.select("*")
        .from("users")
        .where({
            id: id,
        })
        .then((user) => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json("Not found");
            }
        })
        .catch((err) => res.status(400).json("error getting user"));
});

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
