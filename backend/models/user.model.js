const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const accountSchema = new Schema({
    // personal info & security, keep private!
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordResetAt: { type: Date }, // for what purpose does this field exist? I think sth to do with recent resets of pw

    // account credentials
    role: { type: String, required: true }, // user, moderator, admin,
    accountCreatedAt: { type: Date, required: true },
    // verification info
    isVerified: { type: Boolean, required: true }, // "finished signup?"
    verifiedAt: { type: Date },
    verificationCode: { type: String, required: true },
    failedVerifications: { type: Number, required: true },
    // if gets to 3, disable registering this email for a few days, for security.

    // misc
    resetToken: {
        token: String,
        expires: Date,
    },
    lastUpdatedInfo: { type: Date }, // what is this field for? talk about a YAGNI violation
    acceptsTermsAndConditions: { type: Boolean, required: true },
    suspended: { type: Boolean, required: true },

    // public profile
    displayName: { type: String, required: true },
    bio: { type: String, required: false },
    location: { type: String, required: false },
    url: { type: String, required: false },
    followers: { type: Array, required: true },
    following: { type: Array, required: true },
    DMsAreOpen: { type: Boolean, required: true },
    postCount: { type: Number, required: true },
});

module.exports = mongoose.model("Account", accountSchema);
