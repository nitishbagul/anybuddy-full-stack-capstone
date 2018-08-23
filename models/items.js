"use strict";

const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
    itemName: {
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
    placeName: {
        type: String,
        required: false
    },
    placeId: {
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
    categoryName: {
        type: String,
        required: false
    },
    categoryId: {
        type: String,
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

const Items = mongoose.model('Items', itemsSchema);

module.exports = Items;
