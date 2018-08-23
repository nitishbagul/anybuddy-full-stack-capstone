"use strict";

const mongoose = require('mongoose');

const areasSchema = new mongoose.Schema({
    areaName: {
        type: String,
        required: false
    },
    creationDate: {
        type: Date,
        required: false
    },
    lastUpdated: {
        type: Date,
        required: false
    },
    loggedInUserName: {
        type: String,
        required: false
    },
    loggedInUserId: {
        type: String,
        required: false
    }

});

const Areas = mongoose.model('Areas', areasSchema);

module.exports = Areas;
