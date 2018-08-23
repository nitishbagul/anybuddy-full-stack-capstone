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

var Categories = require('../models/categories.js');
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

function seedCategoriesData() {
    console.info('seeding Categories data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            categoryName: faker.address.country(),
            loggedInUserName: "test-user",
            loggedInUserId: "1234"
        });
    }
    return Categories.insertMany(seedData);
}

//Generate random data using faker
function generateCategoriesData() {
    return {
        categoryName: faker.address.country(),
        loggedInUserName: "test-user",
        loggedInUserId: "1234"
    };
}

describe('where-is-it-node-capstone', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedCategoriesData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
    describe('GET endpoint', function () {

        it('should return all categories', function () {
            let res;
            return chai.request(app)
                .get('/categories/get/all/1234')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return Categories.count();
                })
                .then(function (count) {
                    expect(res.body.categoriesOutput).to.have.a.lengthOf(count);
                });
        });

        it('should return all the categories with right fields', function () {
            //let resBlogPost;
            return chai.request(app)
                .get('/categories/get/all/1234')
                .then(function (res) {
                    // console.log(res.body);
                    //Status 200
                    expect(res).to.have.status(200);
                    //Should be a json
                    expect(res).to.be.json;
                    //Should be array
                    expect(res.body.categoriesOutput).to.be.a('array');

                    res.body.categoriesOutput.forEach(function (category) {
                        expect(category).to.be.a('object');
                        expect(category).to.include.keys('categoryName', 'loggedInUserName', 'loggedInUserId');
                    });
                    resCategory = res.body.categoriesOutput[0];
                    return Categories.findById(resCategory._id);
                })

                .then(function (category) {
                    expect(resCategory.loggedInUserName).to.equal(category.loggedInUserName);
                    expect(resCategory.loggedInUserId).to.equal(category.loggedInUserId);
                    expect(resCategory.categoryName).to.equal(category.categoryName);
                });
        });
    });
    describe('POST endpoint', function () {

        it('should add a new category', function () {
            const newCategory = generateCategoriesData();

            return chai.request(app)
                .post('/categories/create')
                .send(newCategory)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('categoryName', 'loggedInUserName', 'loggedInUserId');
                    expect(res.body.categoryName).to.equal(newCategory.categoryName);
                    expect(res.body.loggedInUserName).to.equal(newCategory.loggedInUserName);
                    expect(res.body.loggedInUserId).to.equal(newCategory.loggedInUserId);
                    expect(res.body._id).to.not.be.null;

                    return Categories.findById(res.body._id);
                })
                .then(function (category) {
                    expect(category.categoryName).to.equal(newCategory.categoryName);
                    expect(category.loggedInUserName).to.equal(newCategory.loggedInUserName);
                    expect(category.loggedInUserId).to.equal(newCategory.loggedInUserId);
                });
        });

    });

    describe('DELETE endpoint', function () {

        it('delete an category by id', function () {
            let anyCategory;

            return Categories
                .findOne()
                .then(function (_resCategory) {
                    anyCategory = _resCategory;
                    return chai.request(app).delete(`/category/${anyCategory._id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return Categories.findById(anyCategory._id);
                })
                .then(function (_resCategory) {
                    expect(_resCategory).to.be.null;
                });

        });
    });
});
