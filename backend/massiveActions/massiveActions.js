const express = require("express");
// const cors = require("cors");

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(cors());

const router = express.Router();

module.exports = router;

const db = require("./db");

const massive = "/massive";

// POST a massive to the server
// TODO: add auth here
router.post(massive + "/post", (req, res) => {
    console.log("55555555");
    const user = req.body.user;
    const text = req.body.text;
    const datePosted = Date.now();

    const newMassive = db.Massive({
        postedByUser: user,
        text: text,
        date: datePosted,
        replies: 0,
        amps: 0,
        likes: 0,
        hasImage: false,
        quotesSomeone: false,
    });
    newMassive.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
    res.status(200).send();
});

// GET all massives from the server
router.get(massive + "/get", (req, res) => {
    const filter = {};
    db.Massive.find(filter, function (err, massives) {
        if (err) {
            console.log(err);
        } else {
            console.log(massives);
            res.json(massives);
        }
    });
});

// GET a user's massives
router.get(massive + "/get/:username", (req, res) => {
    const filter = { postedByUser: req.params.username };
    console.log(filter);
    db.Massive.find(filter, function (err, massives) {
        if (err) {
            console.log(err);
        } else {
            console.log(massives);
            res.json(massives);
        }
    });
});

// REPLY to a massive
router.post(massive + "/reply", (req, res) => {});

// AMPLIFY a massive
router.post(massive + "/amplify", (req, res) => {});

// QUOTE AMP a massive
router.post(massive + "/quote", (req, res) => {});

// LIKE a massive
router.post(massive + "/like", (req, res) => {});

// DELETE a massive (required auth from user)
// TODO: put user auth here
router.delete(massive + "/delete", (req, res) => {});
