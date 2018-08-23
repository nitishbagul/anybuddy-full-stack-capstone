"use strict";

const mongoose = require('mongoose');

const placesSchema = new mongoose.Schema({
    placeName: {
        type: String,
        required: false
    },
    areaName: {
        type: String,
        required: false
    },
    areaId: {
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

const Places = mongoose.model('Places', placesSchema);

module.exports = Places;
