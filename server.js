const User = require('./models/user');
const Events = require('./models/events');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

mongoose.Promise = global.Promise;

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server = undefined;

function runServer(urlToUse) {
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                console.log(`Listening on localhost:${config.PORT}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

// ---------------USER ENDPOINTS-------------------------------------
// POST -----------------------------------
// creating a new user
app.post('/users/create', (req, res) => {

    //take the name, username and the password from the ajax api call
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    //exclude extra spaces from the username and password
    username = username.trim();
    password = password.trim();
    email = email.trim();

    //create an encryption key
    bcrypt.genSalt(10, (err, salt) => {

        //if creating the key returns an error...
        if (err) {

            //display it
            return res.status(500).json({
                message: 'Error creating encryption key'
            });
        }

        //using the encryption key above generate an encrypted pasword
        bcrypt.hash(password, salt, (err, hash) => {

            //if creating the ncrypted pasword returns an error..
            if (err) {

                //display it
                return res.status(500).json({
                    message: 'Password encryption failed'
                });
            }

            //using the mongoose DB schema, connect to the database and create the new user
            User.create({
                email,
                username,
                password: hash,
            }, (err, item) => {

                //if creating a new user in the DB returns an error..
                if (err) {
                    //display it
                    return res.status(500).json({
                        message: 'New user creation failed'
                    });
                }
                //if creating a new user in the DB is succefull
                if (item) {

                    //display the new user
                    console.log(`User \`${username}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});

// signing in a user
app.post('/users/login', function (req, res) {

    //take the username and the password from the ajax api call
    const username = req.body.username;
    const password = req.body.password;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    User.findOne({
        username: username
    }, function (err, items) {

        //if the there is an error connecting to the DB
        if (err) {

            //display it
            return res.status(500).json({
                message: "Failed to connect to database"
            });
        }
        // if there are no users with that username
        if (!items) {
            //display it
            return res.status(401).json({
                message: "No username found!"
            });
        }
        //if the username is found
        else {

            //try to validate the password
            items.validatePassword(password, function (err, isValid) {

                //if the connection to the DB to validate the password is not working
                if (err) {

                    //display error
                    console.log('Could not connect to the DB to validate the password.');
                }

                //if the password is not valid
                if (!isValid) {

                    //display error
                    return res.status(401).json({
                        message: "Password Invalid"
                    });
                }
                //if the password is valid
                else {
                    //return the logged in user
                    console.log(`User \`${username}\` logged in.`);
                    return res.json(items);
                }
            });
        };
    });
});


//----------------Events Endpoints-------------
//POST
// creating a new event
app.post('/events/create', (req, res) => {
    let ownerId = req.body.ownerId;
    let ownerName = req.body.ownerName;
    let ownerEmail = req.body.ownerEmail;
    let ownerPhone = req.body.ownerPhone;
    let eventTitle = req.body.eventTitle;
    let eventDate = req.body.eventDate;
    let eventTime = req.body.eventTime;
    let eventStreetAddress = req.body.eventStreetAddress;
    let eventCity = req.body.eventCity;
    let eventState = req.body.eventState;
    let eventZipCode = req.body.eventZipCode;
    let eventCountry = req.body.eventCountry;
    let lat = req.body.lat;
    let lng = req.body.lng;
    let partnersRequired = req.body.partnersRequired;
    let partners = req.body.partners;
    let creationDate = new Date();

    Events.create({
        ownerId,
        ownerName,
        ownerEmail,
        ownerPhone,
        eventTitle,
        eventDate,
        eventTime,
        eventTime,
        eventStreetAddress,
        eventCity,
        eventState,
        eventZipCode,
        eventCountry,
        lat,
        lng,
        partnersRequired,
        partners,
        creationDate
    }, (err, event) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (event) {
            return res.json(event);
        }
    });

});

//PUT
//Edit Event
app.put('/event/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = "Id in the request and body should match";
        console.error(message);
        return res.status(400).json({
            message: message
        });
    }

    const toUpdate = {};
    const updateableFields = ['eventTitle', 'eventDate', 'eventTime', 'partnersRequired'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Events
        .findByIdAndUpdate(req.params.id, {
            $set: toUpdate
        })
        .then(items => res.status(204).json(items))
        .catch(err => res.status(500).json({
            message: 'Inernal server error'
        }));
});

//Add partner
app.put('/event/partner/add/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = "Id in the request and body should match";
        console.error(message);
        return res.status(400).json({
            message: message
        });
    }

    const toUpdate = {};
    const updateableFields = ['partners'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Events
        .findByIdAndUpdate(req.params.id, {
            $push: toUpdate
        })
        .then(items => res.status(204).json(items))
        .catch(err => res.status(500).json({
            message: 'Inernal server error'
        }));
});

//Remove partner
app.put('/event/partner/remove/:eventId/:partnerId', (req, res) => {
    if (!(req.params.eventId && req.params.partnerId && req.body.eventId && req.params.eventId === req.body.eventId)) {
        const message = "Id in the request and body should match";
        console.error(message);
        return res.status(400).json({
            message: message
        });
    }
    Events
        .findByIdAndUpdate(req.params.eventId, {
            $pull: {
                'partners': {
                    _id: req.params.partnerId
                }
            }
        })
        .then(items => res.status(204).json(items))
        .catch(err => res.status(500).json({
            message: 'Inernal server error'
        }));
});


// GET
//all events by userID
app.get('/events/get/all/:userId', function (req, res) {

    Events
        .find()
        .then(function (events) {
            let eventsOutput = [];
            events.map(function (event) {
                if (event.ownerId == req.params.userId) {
                    eventsOutput.push(event);
                }
            });
            res.json({
                eventsOutput
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});

//other events by userID
app.get('/events/get/all/others/:userId', function (req, res) {

    Events
        .find()
        .then(function (events) {
            let allOtherEvents = events.filter(function processOther(event) {
                return !(event.ownerId == req.params.userId);
            });

            let checkUserEntry = allOtherEvents.filter(function checkUser(event) {
                let checkPartnerEntry = event.partners.filter(function checkPartner(partner) {
                    return partner.partnerId == req.params.userId;
                })
                return (checkPartnerEntry.length) > 0;
            });
            res.json({
                checkUserEntry
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});

//all Events by Lat-Long
app.get('/events/get/:userLat/:userLng', function (req, res) {
    let userLatitude = parseFloat((req.params.userLat)).toFixed(7);
    let userLongitude = parseFloat((req.params.userLng)).toFixed(7);
    console.log(userLatitude, userLongitude);
    console.log(typeof userLatitude, typeof userLongitude);

    Events
        .find({
            lat: {

                $gt: parseFloat(userLatitude) - 1,
                $lt: parseFloat(userLatitude) + 1

            },
            lng: {
                $gt: parseFloat(userLongitude) - 1,
                $lt: parseFloat(userLongitude) + 1
            }
        })
        .then(function (events) {
            console.log(events);
            //            let eventsOutput = [];
            //            items.map(function (item) {
            //                if (item.loggedInUserId == req.params.id) {
            //                    itemsOutput.push(item);
            //                }
            //            });
            res.json({
                events
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});

// Geting Item by ID
app.get('/item/:id', function (req, res) {
    Items
        .findById(req.params.id).exec().then(function (item) {
            return res.json(item);
        })
        .catch(function (items) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});



//all items by category ID
app.get('/items/get/all/:id/:categoryId', function (req, res) {

    Items
        .find()
        .then(function (items) {
            let itemsOutput = [];
            items.map(function (item) {
                if (item.loggedInUserId == req.params.id && item.categoryId == req.params.categoryId) {
                    itemsOutput.push(item);
                }
            });
            res.json({
                itemsOutput
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});


//DELETE
app.delete('/item/:id', function (req, res) {
    Items.findByIdAndRemove(req.params.id).exec().then(function (item) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;
