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

var Items = require('../models/items.js');
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

function seedItemsData() {
    console.info('seeding Items data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            itemName: faker.company.companyName(),
            placeName: faker.address.city(),
            placeId: faker.hacker.adjective(),
            areaName: faker.address.country(),
            areaId: faker.hacker.adjective(),
            categoryName: faker.lorem.word(),
            categoryId: faker.hacker.noun(),
            loggedInUserName: "test-user",
            loggedInUserId: "1234"
        });
    }
    return Items.insertMany(seedData);
}

//Generate random data using faker
function generateItemsData() {
    return {
        itemName: faker.company.companyName(),
        placeName: faker.address.city(),
        placeId: faker.hacker.adjective(),
        areaName: faker.address.country(),
        areaId: faker.hacker.adjective(),
        categoryName: faker.lorem.word(),
        categoryId: faker.hacker.noun(),
        loggedInUserName: "test-user",
        loggedInUserId: "1234"
    };
}

describe('where-is-it-node-capstone', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedItemsData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
    describe('GET endpoint', function () {

        it('should return all items', function () {
            let res;
            return chai.request(app)
                .get('/items/get/all/1234')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return Items.count();
                })
                .then(function (count) {
                    expect(res.body.itemsOutput).to.have.a.lengthOf(count);
                });
        });

        it('should return all the items with right fields', function () {
            //let resBlogPost;
            return chai.request(app)
                .get('/items/get/all/1234')
                .then(function (res) {
                    // console.log(res.body);
                    //Status 200
                    expect(res).to.have.status(200);
                    //Should be a json
                    expect(res).to.be.json;
                    //Should be array
                    expect(res.body.itemsOutput).to.be.a('array');

                    res.body.itemsOutput.forEach(function (item) {
                        expect(item).to.be.a('object');
                        expect(item).to.include.keys('itemName', 'areaName', 'areaId', 'placeName', 'placeId', 'categoryName', 'categoryId');
                    });
                    resItem = res.body.itemsOutput[0];
                    return Items.findById(resItem._id);
                })

                .then(function (item) {
                    expect(resItem.itemName).to.equal(item.itemName);
                    expect(resItem.areaName).to.equal(item.areaName);
                    expect(resItem.areaId).to.equal(item.areaId);
                    expect(resItem.placeName).to.equal(item.placeName);
                    expect(resItem.placeId).to.equal(item.placeId);
                    expect(resItem.categoryName).to.equal(item.categoryName);
                    expect(resItem.categoryId).to.equal(item.categoryId);
                });
        });
    });
    describe('POST endpoint', function () {

        it('should add a new item', function () {
            const newItem = generateItemsData();

            return chai.request(app)
                .post('/items/create')
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

    describe('PUT endpoint', function () {

        it('should update item fields you send over', function () {
            const updateItem = {
                placeName: 'fofoplace',
                placeId: 'fofoplaceid',
                areaName: 'fofoarea',
                areaId: 'fofoareaid'
            };

            return Items
                .findOne()
                .then(function (item) {
                    updateItem.id = item._id;

                    // make request then inspect it to make sure it reflects
                    // data we sent
                    return chai.request(app)
                        .put(`/items/${item._id}`)
                        .send(updateItem);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);

                    return Items.findById(updateItem.id);
                })
                .then(function (itemElement) {
                    expect(itemElement.placeName).to.equal(updateItem.placeName);
                    expect(itemElement.placeId).to.equal(updateItem.placeId);
                    expect(itemElement.areaName).to.equal(updateItem.areaName);
                    expect(itemElement.areaId).to.equal(updateItem.areaId);
                });
        });
    });

    describe('DELETE endpoint', function () {

        it('delete an item by id', function () {
            let anyItem;

            return Items
                .findOne()
                .then(function (_resItem) {
                    anyItem = _resItem;
                    return chai.request(app).delete(`/item/${anyItem._id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return Items.findById(anyItem._id);
                })
                .then(function (_resItem) {
                    expect(_resItem).to.be.null;
                });

        });
    });
});
