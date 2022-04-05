const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser")
const { body, validationResult } = require('express-validator');
const users = require("./data.json")

const port = 8000
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))

// app.use(bodyParser.urlencoded()) 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((req, _, next) => {
    console.log("new request", req.method, req.url);
    next()
})
app.get("/", (_, res) => {
    res.render("home", { users })
})
app.post("/neuerUser",
    body("fname").isLength({ min: 1, max: 10 }),
    body("lname").isLength({ min: 1, max: 25 }),
    body("email").isEmail(),
    body("txt").notEmpty(),
    (req, res) => {
        // res.send(req.body)
        // res.send(req.body.fname)
        const neuerUser = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const validationErrors = errors.array()
            res.render("inValidData", { description: "user input is invalid, please try again...", validationErrors })
            return
        }
        users.push(neuerUser)

        const dataString = JSON.stringify(users)
        fs.writeFile("./data.json", dataString, err => {
            if (err) {
                console.log(err);
                return
            }
        })
        res.redirect("/")
    })
app.use((req, res) => {
    console.log(req.method, req.url, 'route was not found...');
    res.end()
})

app.listen(port, () => console.log("Server listening on Port"), port)