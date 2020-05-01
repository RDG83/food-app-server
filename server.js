require('dotenv').config()
const express = require("express");
var cors = require("cors");
const app = express();
const port = 4000;
const bcrypt = require("bcrypt-nodejs");
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: 'food_app'
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const database = {
    users: [
        {
            id: "123",
            name: "Test",
            email: "test@gmail.com",
            password: "test",
            entries: 0,
            joined: new Date(),
        },
        {
            id: "234",
            name: "Sara",
            email: "sara@gmail.com",
            password: "pear",
            entries: 0,
            joined: new Date(),
        },
    ],
    login: [
        {
            id: "321",
            hash: "",
            email: "john@gmail.com",
        },
    ],
};

// ROOT
app.get("/", (req, res) => {
    res.json(database.users);
});

// SIGNING ROUTE
app.post("/signin", (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.send("incorrect login please try again");
    }
});

// REGISTER ROUTE
app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function (err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: "567",
        name: name,
        email: email,
        entries: 0,
        joined: new Date(),
    });
    res.json(database.users[database.users.length - 1]);
});

// PROFILE ROUTE
app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach((user) => {
        if (user.id == id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found) {
        res.json("failed to find user");
    }
});

// IMAGE ROUTE
app.put("/image", (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach((user) => {
        if (user.id == id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.json("failed to find user");
    }
});

//   // Load hash from your password DB.
//   bcrypt.compare("bacon", hash, function(err, res) {
//       // res == true
//   });
//   bcrypt.compare("veggies", hash, function(err, res) {
//       // res = false
//   });

// START THE SERVER
app.listen(port, () => {
    console.log("app is running at port: ", port);
});
