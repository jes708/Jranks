// Instantiate all models
var expect = require('chai').expect;
var Sequelize = require('sequelize');
var db = require('../../../server/db');
var supertest = require('supertest');

describe('Members Route', function () {

    var app, User, Inventory;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        User = db.model('user');
        Inventory = db.model('inventory');
    });

	describe('Unauthenticated request', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('should get a 401 response', function (done) {
			guestAgent.get('/api/members/secret-stash')
				.expect(401)
				.end(done);
		});

	});

	describe('Authenticated request', function () {

		var loggedInAgent;

		var userInfo = {
    name: 'J Humiston',
    birth: 10 / 15 / 1988,
    email: 'testing@fsa.com',
    password: 'password'
  };

		beforeEach('Create a user', function (done) {
			return User.create(userInfo).then(function (user) {
                done();
            }).catch(done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should get with 200 response and with an array as the body', function (done) {
			loggedInAgent.get('/api/members/secret-stash').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				done();
			});
		});

	});

});
