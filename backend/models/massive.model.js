const mongoose = require("mongoose");

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const massiveSchema = new Schema({
    postedByUser: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: String, required: true },
    viewCount: { type: Number, required: true },
    viewQuota: { type: Number, required: true },
    // engagement
    replies: { type: Number, required: true },
    amps: { type: Number, required: true },
    likes: { type: Number, required: true },
    // modifiers
    hasImage: { type: Boolean, required: true },
    imageURL: { type: String, required: false },
    // indicates whether the massive is a quote tweet.
    quotesSomeone: { type: Boolean, required: true },
    quotedMassiveId: { type: String, required: false },
});

module.exports = mongoose.model("Massive", massiveSchema);
