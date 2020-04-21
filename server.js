const express = require("express");
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "apple",
            entries: 0,
        },
        {
            id: "234",
            name: "Sara",
            email: "sara@gmail.com",
            password: "pear",
            entries: 0,
        },
        {
            id: "345",
            name: "Todd",
            email: "todd@gmail.com",
            password: "banana",
            entries: 0,
        },
        {
            id: "456",
            name: "Linda",
            email: "linda@gmail.com",
            password: "melon",
            entries: 0,
        },
    ],
};

// ROOT
app.get("/", (req, res) => {
    res.json(database.users);
});

// SIGNING ROUTE
app.post("/signin", (req, res) => {
    if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        res.json("succes");
    } else {
        res.send("incorrect login please try again");
    }
});

// REGISTER ROUTE
app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: "567",
        name: name,
        email: email,
        password: password,
        joined: new Date(),
    });
    res.send("added new user");
    console.log(database.users);
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
app.post("/image", (req, res) => {
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

// START THE SERVER
app.listen(port, () => {
    console.log("app is running at port: ", port);
});
