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
        } else {
            res.status(200).send();
        }
    });
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

// TODO: protect all reply,amp,quote,like, with user auth

// REPLY to a massive
router.post(massive + "/reply", (req, res) => {
    // TODO: get all the relevant info from the client... change the null values to whatever they actually are
    const username = null;
    const text = null;
    const date = new Date.now();
    const viewQuota = null;
    const hasImage = null;
    const imageURL = null;
    const quotesSomeone = null;
    const quotedMassiveId = null;

    const newReply = db.Reply({
        postedByUser: username,
        text: text,
        date: date,
        viewCount: 0, // always starts at 0...
        viewQuota: viewQuota,
        replies: 0,
        amps: 0,
        likes: 0,
        hasImage: hasImage,
        imageURL: imageURL, // todo: save image to a db, generate the URL to the img, and put it here
        quotesSomeone: quotesSomeone,
        quotedMassiveId: quotesSomeone ? quotedMassiveId : null,
    });
    newReply.save(function (err, saved) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send();
        }
    });
});

// AMPLIFY a massive
router.post(massive + "/amplify/:username", (req, res) => {
    // increment the massive's amps by 1 & add the user to the massive's amp list
    const amplifyingUser = req.body.username;
    const massiveId = req.body.massiveId;
    const massiveToAmp = db.Massive.find({ massiveId });
    massiveToAmp.update(
        { amps: massiveToAmp.amps + 1 },
        { $push: { ampsList: amplifyingUser } }
    );
    // put the massive onto the user's timeline, push it to their followers
    db.User.findByIdAndUpdate(
        {
            _id: amplifyingUser,
        },
        // including another user's massiveId in the list signals that it is plain amp.
        // if the amplified massive is a reply, simply including the reply's id includes the reply in the timeline.
        { $push: { massivesList: massiveId } },
        function (err, success) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send();
            }
        }
    );
});

// QUOTE AMP a massive
router.post(massive + "/quote", (req, res) => {
    const amplifyingUser = req.body.username;
    const quoteText = req.body.text;
    const datePosted = Date.now();
    const quotedMassiveId = req.body.id;
    const massiveToAmp = db.Massive.find({ massiveId });
    // update the massive being quoted with an additional amp + put the user quoting it onto its quotesList
    massiveToAmp.update(
        { quoteAmps: massiveToAmp.quoteAmps + 1 },
        { $push: { quotesList: amplifyingUser } }
        // BUG here probably.
        // similar to the other .update() call down below.
    );

    // put the massive onto the user's timeline, push it to their followers
    const newMassive = db.Massive({
        postedByUser: amplifyingUser,
        text: quoteText,
        date: datePosted,
        replies: 0,
        amps: 0,
        likes: 0,
        hasImage: false,
        quotesSomeone: true,
        quotedMassiveId: quotedMassiveId,
    });
    newMassive.save(function (err, success) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send();
        }
    });
});

// LIKE a massive
router.post(massive + "/like", (req, res) => {
    const likedBy = req.body.username;
    const massiveId = req.body.massiveId;
    const massiveToLike = db.Massive.find({ massiveId });
    massiveToLike.update(
        { likes: massiveToLIke.likes + 1 },
        { $push: { likesList: likedBy } }
        // BUG here probably.
        // I'm HOPING that this .update() tells the computer,
        // "update the likes field with an increment of 1, and push a new entry to the likesList"
        // but the bug will probably be, "filter by likes, and then push a new entry to the likesList"
    );
});

// DELETE a massive (required auth from user)
// TODO: put user auth here
router.delete(massive + "/delete/:username", (req, res) => {
    // just tells the server to tell users its deleted; it no longer shows on the site.
    // Only a moderator can actually delete it from the db. Why? Idk, logging, and for hypothetical ML to learn from.
    const username = req.params.username;
    const massiveId = req.body.massiveId;
    db.Massive.findOneAndUpdate(
        { _id: massiveId, postedByUser: username },
        { deletedByUser: true },
        function (err, success) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send();
            }
        }
    );
});
