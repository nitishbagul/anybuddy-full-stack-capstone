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

var Events = require('../models/events.js');
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

function seedEventsData() {
    console.info('seeding Events data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            ownerId: "1234",
            ownerName: faker.name.firstName(),
            ownerEmail: faker.internet.email(),
            ownerPhone: faker.phone.phoneNumber(),
            eventTitle: faker.random.words(),
            eventDate: faker.date.recent(),
            eventTime: faker.random.word(),
            eventStreetAddress: faker.address.streetAddress(),
            eventCity: faker.address.city(),
            eventState: faker.address.state(),
            eventCountry: faker.address.country(),
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
            partnersRequired: faker.random.number()
        });
    }
    return Events.insertMany(seedData);
}

//Generate random for a single event
function generateEventsData() {
    return {
        ownerId: "1234",
        ownerName: faker.name.firstName(),
        ownerEmail: faker.internet.email(),
        ownerPhone: faker.random.phoneNumber(),
        eventTitle: faker.random.words(),
        eventDate: faker.date.soon(),
        eventTime: faker.random.word(),
        eventStreetAddress: faker.address.streetAddress(),
        eventCity: faker.address.city(),
        eventState: faker.address.state(),
        eventCountry: faker.address.country(),
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        partnersRequired: faker.random.number()
    };
}

describe('anybuddy-full-stack-capstone', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedEventsData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
    describe('GET endpoint', function () {

        it('should return all events', function () {
            let res;
            return chai.request(app)
                .get('/events/get/all/1234')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return Events.count();
                })
                .then(function (count) {
                    expect(res.body.eventsOutput).to.have.a.lengthOf(count);
                });
        });

        it('should return all the events with right fields', function () {
            return chai.request(app)
                .get('/events/get/all/1234')
                .then(function (res) {
                    console.log(res.body);
                    //Status 200
                    expect(res).to.have.status(200);
                    //Should be a json
                    expect(res).to.be.json;
                    //Should be array
                    expect(res.body.eventsOutput).to.be.a('array');

                    res.body.eventsOutput.forEach(function (event) {
                        expect(event).to.be.a('object');
                        expect(event).to.include.keys('ownerId', 'ownerName', 'ownerEmail', 'ownerPhone', 'eventTitle', 'eventDate', 'eventTime', 'eventStreetAddress', 'eventCity', 'eventState', 'eventCountry', 'lat', 'lng', 'partnersRequired');
                    });
                    resEvent = res.body.eventsOutput[0];
                    return Events.findById(resEvent._id);
                })

                .then(function (event) {
                    expect(resEvent.ownerId).to.equal(event.ownerId);
                    expect(resEvent.ownerName).to.equal(event.ownerName);
                    expect(resEvent.ownerEmail).to.equal(event.ownerEmail);
                    expect(resEvent.ownerPhone).to.equal(event.ownerPhone);
                    expect(resEvent.eventTitle).to.equal(event.eventTitle);
                    //expect(resEvent.eventDate).to.equal(event.eventDate);
                    expect(resEvent.eventTime).to.equal(event.eventTime);
                    expect(resEvent.eventStreetAddress).to.equal(event.eventStreetAddress);
                    expect(resEvent.eventCity).to.equal(event.eventCity);
                    expect(resEvent.eventState).to.equal(event.eventState);
                    expect(resEvent.eventCountry).to.equal(event.eventCountry);
                    expect(resEvent.lat).to.equal(event.lat);
                    expect(resEvent.lng).to.equal(event.lng);
                    expect(resEvent.partnersRequired).to.equal(event.partnersRequired);
                });
        });
    });
    describe('POST endpoint', function () {

        it('should add a new item', function () {
            const newEvent = generateEventsData();

            return chai.request(app)
                .post('/events/create')
                .send(newItem)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('itemName', 'areaName', 'areaId', 'placeName', 'placeId', 'categoryName', 'categoryId');
                    expect(res.body.itemName).to.equal(newItem.itemName);
                    expect(res.body.areaName).to.equal(newItem.areaName);
                    expect(res.body.areaId).to.equal(newItem.areaId);
                    expect(res.body.placeName).to.equal(newItem.placeName);
                    expect(res.body.placeId).to.equal(newItem.placeId);
                    expect(res.body.categoryName).to.equal(newItem.categoryName);
                    expect(res.body.categoryId).to.equal(newItem.categoryId);
                    expect(res.body._id).to.not.be.null;

                    return Items.findById(res.body._id);
                })
                .then(function (item) {
                    expect(item.itemName).to.equal(newItem.itemName);
                    expect(item.areaName).to.equal(newItem.areaName);
                    expect(item.areaId).to.equal(newItem.areaId);
                    expect(item.placeName).to.equal(newItem.placeName);
                    expect(item.placeId).to.equal(newItem.placeId);
                    expect(item.categoryName).to.equal(newItem.categoryName);
                    expect(item.categoryId).to.equal(newItem.categoryId);
                });
        });

    });

    //    describe('PUT endpoint', function () {
    //
    //        it('should update item fields you send over', function () {
    //            const updateItem = {
    //                placeName: 'fofoplace',
    //                placeId: 'fofoplaceid',
    //                areaName: 'fofoarea',
    //                areaId: 'fofoareaid'
    //            };
    //
    //            return Items
    //                .findOne()
    //                .then(function (item) {
    //                    updateItem.id = item._id;
    //
    //                    // make request then inspect it to make sure it reflects
    //                    // data we sent
    //                    return chai.request(app)
    //                        .put(`/items/${item._id}`)
    //                        .send(updateItem);
    //                })
    //                .then(function (res) {
    //                    expect(res).to.have.status(204);
    //
    //                    return Items.findById(updateItem.id);
    //                })
    //                .then(function (itemElement) {
    //                    expect(itemElement.placeName).to.equal(updateItem.placeName);
    //                    expect(itemElement.placeId).to.equal(updateItem.placeId);
    //                    expect(itemElement.areaName).to.equal(updateItem.areaName);
    //                    expect(itemElement.areaId).to.equal(updateItem.areaId);
    //                });
    //        });
    //    });
    //
    //    describe('DELETE endpoint', function () {
    //
    //        it('delete an item by id', function () {
    //            let anyItem;
    //
    //            return Items
    //                .findOne()
    //                .then(function (_resItem) {
    //                    anyItem = _resItem;
    //                    return chai.request(app).delete(`/item/${anyItem._id}`);
    //                })
    //                .then(function (res) {
    //                    expect(res).to.have.status(204);
    //                    return Items.findById(anyItem._id);
    //                })
    //                .then(function (_resItem) {
    //                    expect(_resItem).to.be.null;
    //                });
    //
    //        });
    //    });
});
