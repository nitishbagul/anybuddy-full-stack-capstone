"use strict";

const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    categoryName: {
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

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;
