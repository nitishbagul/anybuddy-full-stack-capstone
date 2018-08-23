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

var Areas = require('../models/areas.js');
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

function seedAreasData() {
    console.info('seeding Areas data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            areaName: faker.address.country(),
            loggedInUserName: "test-user",
            loggedInUserId: "1234"
        });
    }
    return Areas.insertMany(seedData);
}

//Generate random data using faker
function generateAreasData() {
    return {
        areaName: faker.address.country(),
        loggedInUserName: "test-user",
        loggedInUserId: "1234"
    };
}

describe('where-is-it-node-capstone', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedAreasData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
    describe('GET endpoint', function () {

        it('should return all areas', function () {
            let res;
            return chai.request(app)
                .get('/areas/get/all/1234')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return Areas.count();
                })
                .then(function (count) {
                    expect(res.body.areasOutput).to.have.a.lengthOf(count);
                });
        });

        it('should return all the areas with right fields', function () {
            //let resBlogPost;
            return chai.request(app)
                .get('/areas/get/all/1234')
                .then(function (res) {
                    // console.log(res.body);
                    //Status 200
                    expect(res).to.have.status(200);
                    //Should be a json
                    expect(res).to.be.json;
                    //Should be array
                    expect(res.body.areasOutput).to.be.a('array');

                    res.body.areasOutput.forEach(function (area) {
                        expect(area).to.be.a('object');
                        expect(area).to.include.keys('areaName', 'loggedInUserName', 'loggedInUserId');
                    });
                    resArea = res.body.areasOutput[0];
                    return Areas.findById(resArea._id);
                })

                .then(function (area) {
                    expect(resArea.loggedInUserName).to.equal(area.loggedInUserName);
                    expect(resArea.loggedInUserId).to.equal(area.loggedInUserId);
                    expect(resArea.areaName).to.equal(area.areaName);
                });
        });
    });
    describe('POST endpoint', function () {

        it('should add a new area', function () {
            const newArea = generateAreasData();

            return chai.request(app)
                .post('/areas/create')
                .send(newArea)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('areaName', 'loggedInUserName', 'loggedInUserId');
                    expect(res.body.areaName).to.equal(newArea.areaName);
                    expect(res.body.loggedInUserName).to.equal(newArea.loggedInUserName);
                    expect(res.body.loggedInUserId).to.equal(newArea.loggedInUserId);
                    expect(res.body._id).to.not.be.null;

                    return Areas.findById(res.body._id);
                })
                .then(function (area) {
                    expect(area.areaName).to.equal(newArea.areaName);
                    expect(area.loggedInUserName).to.equal(newArea.loggedInUserName);
                    expect(area.loggedInUserId).to.equal(newArea.loggedInUserId);
                });
        });

    });

    describe('DELETE endpoint', function () {

        it('delete an area by id', function () {
            let anyArea;

            return Areas
                .findOne()
                .then(function (_resArea) {
                    anyArea = _resArea;
                    return chai.request(app).delete(`/area/${anyArea._id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return Areas.findById(anyArea._id);
                })
                .then(function (_resArea) {
                    expect(_resArea).to.be.null;
                });

        });
    });
});
