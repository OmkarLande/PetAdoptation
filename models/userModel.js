const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    pets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
    },
    approved: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('User', userModel);
