"use strict";

const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: false
    },
    ownerName: {
        type: String,
        required: false
    },
    ownerEmail: {
        type: String,
        required: false
    },
    ownerPhone: {
        type: String,
        required: false
    },
    eventTitle: {
        type: String,
        required: false
    },
    eventDate: {
        type: Date,
        required: false
    },
    eventTime: {
        type: String,
        required: false
    },
    eventStreetAddress: {
        type: String,
        required: false
    },
    eventCity: {
        type: String,
        required: false
    },
    eventState: {
        type: String,
        required: false
    },
    eventZipcode: {
        type: String,
        required: false
    },
    eventCountry: {
        type: String,
        required: false
    },
    creationDate: {
        type: Date,
        required: false
    },
    lat: {
        type: Number,
        required: false
    },
    lng: {
        type: Number,
        required: false
    },
    partnersRequired: {
        type: Number,
        required: false
    },
    partners: [{
        partnerId: String,
        partnerName: String,
        partnerEmail: String,
        partnerPhone: String,
        partnerStatus: String,
        required: false
    }]
});

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;
