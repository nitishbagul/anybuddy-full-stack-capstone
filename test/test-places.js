const {
    app,
    runServer,
    closeServer
} = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
var expect = chai.expect;

var Places = require('../models/places.js');
const {
    TEST_DATABASE_URL
} = require('../config');

var should = chai.should();

chai.use(chaiHttp);

function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function seedPlacesData() {
    console.info('seeding Places data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            placeName: faker.address.city(),
            areaName: faker.address.country(),
            areaId: faker.hacker.adjective(),
            loggedInUserName: "test-user",
            loggedInUserId: "1234"
        });
    }
    return Places.insertMany(seedData);
}

//Generate random data using faker
function generatePlacesData() {
    return {
        placeName: faker.address.city(),
        areaName: faker.address.country(),
        areaId: faker.hacker.adjective(),
        loggedInUserName: "test-user",
        loggedInUserId: "1234"
    };
}

describe('where-is-it-node-capstone', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedPlacesData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
    describe('GET endpoint', function () {

        it('should return all places', function () {
            let res;
            return chai.request(app)
                .get('/places/get/all/1234')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return Places.count();
                })
                .then(function (count) {
                    expect(res.body.placesOutput).to.have.a.lengthOf(count);
                });
        });

        it('should return all the places with right fields', function () {
            //let resBlogPost;
            return chai.request(app)
                .get('/places/get/all/1234')
                .then(function (res) {
                    // console.log(res.body);
                    //Status 200
                    expect(res).to.have.status(200);
                    //Should be a json
                    expect(res).to.be.json;
                    //Should be array
                    expect(res.body.placesOutput).to.be.a('array');

                    res.body.placesOutput.forEach(function (place) {
                        expect(place).to.be.a('object');
                        expect(place).to.include.keys('areaName', 'areaId', 'placeName', 'loggedInUserName', 'loggedInUserId');
                    });
                    resPlace = res.body.placesOutput[0];
                    return Places.findById(resPlace._id);
                })

                .then(function (place) {
                    expect(resPlace.loggedInUserName).to.equal(place.loggedInUserName);
                    expect(resPlace.loggedInUserId).to.equal(place.loggedInUserId);
                    expect(resPlace.areaName).to.equal(place.areaName);
                    expect(resPlace.areaId).to.equal(place.areaId);
                    expect(resPlace.placeName).to.equal(place.placeName);

                });
        });
    });
    describe('POST endpoint', function () {

        it('should add a new place', function () {
            const newPlace = generatePlacesData();

            return chai.request(app)
                .post('/places/create')
                .send(newPlace)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('areaName', 'areaId', 'placeName', 'loggedInUserName', 'loggedInUserId');
                    expect(res.body.areaId).to.equal(newPlace.areaId);
                    expect(res.body.placeName).to.equal(newPlace.placeName);
                    expect(res.body.areaName).to.equal(newPlace.areaName);
                    expect(res.body.loggedInUserName).to.equal(newPlace.loggedInUserName);
                    expect(res.body.loggedInUserId).to.equal(newPlace.loggedInUserId);
                    expect(res.body._id).to.not.be.null;

                    return Places.findById(res.body._id);
                })
                .then(function (place) {
                    expect(place.areaName).to.equal(newPlace.areaName);
                    expect(place.areaId).to.equal(newPlace.areaId);
                    expect(place.placeName).to.equal(newPlace.placeName);
                    expect(place.loggedInUserName).to.equal(newPlace.loggedInUserName);
                    expect(place.loggedInUserId).to.equal(newPlace.loggedInUserId);
                });
        });

    });

    describe('PUT endpoint', function () {

        it('should update place fields you send over', function () {
            const updatePlace = {
                areaName: 'fofoarea',
                areaId: 'fofoareaid'
            };

            return Places
                .findOne()
                .then(function (place) {
                    updatePlace.id = place._id;

                    // make request then inspect it to make sure it reflects
                    // data we sent
                    return chai.request(app)
                        .put(`/places/${place._id}`)
                        .send(updatePlace);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);

                    return Places.findById(updatePlace.id);
                })
                .then(function (placeElement) {
                    //console.log(placeElement);
                    expect(placeElement.areaName).to.equal(updatePlace.areaName);
                    expect(placeElement.areaId).to.equal(updatePlace.areaId);

                });
        });
    });

    describe('DELETE endpoint', function () {

        it('delete an place by id', function () {
            let anyPlace;

            return Places
                .findOne()
                .then(function (_resPlace) {
                    anyPlace = _resPlace;
                    return chai.request(app).delete(`/place/${anyPlace._id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return Places.findById(anyPlace._id);
                })
                .then(function (_resPlace) {
                    expect(_resPlace).to.be.null;
                });

        });
    });
});
