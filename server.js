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
    const updateableFields = ['eventTitle', 'eventDate', 'eventTime'];

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

//Removing some fields
//PUT
app.put('/items/remove/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = "Id in the request and body should match";
        console.error(message);
        return res.status(400).json({
            message: message
        });
    }

    const toRemove = {};
    const updateableFields = ['placeName', 'placeId', 'areaName', 'areaId', 'categoryName', 'categoryId'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toRemove[field] = req.body[field];
        }
    });

    Items
        .findByIdAndUpdate(req.params.id, {
            $unset: toRemove
        })
        .then(items => res.status(204).json(items))
        .catch(err => res.status(500).json({
            message: 'Inernal server error'
        }));
});

// GET
// all items by user
app.get('/items/:user', function (req, res) {

    Items
        .find()
        .then(function (items) {
            let itemsOutput = [];
            items.map(function (item) {
                if (item.loggedInUserName == req.params.user) {
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

//all items by userID
app.get('/items/get/all/:id', function (req, res) {

    Items
        .find()
        .then(function (items) {
            let itemsOutput = [];
            items.map(function (item) {
                if (item.loggedInUserId == req.params.id) {
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

// Geting Item by Name-Search
app.get('/items-search/:itemName/:id', function (req, res) {

    Items
        .find({
            itemName: {
                $regex: `.*${req.params.itemName}.*`,
                $options: "i"
            }
        })
        .then(function (items) {
            let itemsOutput = [];
            items.map(function (item) {
                if (item.loggedInUserId == req.params.id) {
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
