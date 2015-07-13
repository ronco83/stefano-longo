'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Work = mongoose.model('Work'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, work;

/**
 * Work routes tests
 */
describe('Work CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Work
		user.save(function() {
			work = {
				name: 'Work Name'
			};

			done();
		});
	});

	it('should be able to save Work instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Work
				agent.post('/works')
					.send(work)
					.expect(200)
					.end(function(workSaveErr, workSaveRes) {
						// Handle Work save error
						if (workSaveErr) done(workSaveErr);

						// Get a list of Works
						agent.get('/works')
							.end(function(worksGetErr, worksGetRes) {
								// Handle Work save error
								if (worksGetErr) done(worksGetErr);

								// Get Works list
								var works = worksGetRes.body;

								// Set assertions
								(works[0].user._id).should.equal(userId);
								(works[0].name).should.match('Work Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Work instance if not logged in', function(done) {
		agent.post('/works')
			.send(work)
			.expect(401)
			.end(function(workSaveErr, workSaveRes) {
				// Call the assertion callback
				done(workSaveErr);
			});
	});

	it('should not be able to save Work instance if no name is provided', function(done) {
		// Invalidate name field
		work.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Work
				agent.post('/works')
					.send(work)
					.expect(400)
					.end(function(workSaveErr, workSaveRes) {
						// Set message assertion
						(workSaveRes.body.message).should.match('Please fill Work name');
						
						// Handle Work save error
						done(workSaveErr);
					});
			});
	});

	it('should be able to update Work instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Work
				agent.post('/works')
					.send(work)
					.expect(200)
					.end(function(workSaveErr, workSaveRes) {
						// Handle Work save error
						if (workSaveErr) done(workSaveErr);

						// Update Work name
						work.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Work
						agent.put('/works/' + workSaveRes.body._id)
							.send(work)
							.expect(200)
							.end(function(workUpdateErr, workUpdateRes) {
								// Handle Work update error
								if (workUpdateErr) done(workUpdateErr);

								// Set assertions
								(workUpdateRes.body._id).should.equal(workSaveRes.body._id);
								(workUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Works if not signed in', function(done) {
		// Create new Work model instance
		var workObj = new Work(work);

		// Save the Work
		workObj.save(function() {
			// Request Works
			request(app).get('/works')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Work if not signed in', function(done) {
		// Create new Work model instance
		var workObj = new Work(work);

		// Save the Work
		workObj.save(function() {
			request(app).get('/works/' + workObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', work.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Work instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Work
				agent.post('/works')
					.send(work)
					.expect(200)
					.end(function(workSaveErr, workSaveRes) {
						// Handle Work save error
						if (workSaveErr) done(workSaveErr);

						// Delete existing Work
						agent.delete('/works/' + workSaveRes.body._id)
							.send(work)
							.expect(200)
							.end(function(workDeleteErr, workDeleteRes) {
								// Handle Work error error
								if (workDeleteErr) done(workDeleteErr);

								// Set assertions
								(workDeleteRes.body._id).should.equal(workSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Work instance if not signed in', function(done) {
		// Set Work user 
		work.user = user;

		// Create new Work model instance
		var workObj = new Work(work);

		// Save the Work
		workObj.save(function() {
			// Try deleting Work
			request(app).delete('/works/' + workObj._id)
			.expect(401)
			.end(function(workDeleteErr, workDeleteRes) {
				// Set message assertion
				(workDeleteRes.body.message).should.match('User is not logged in');

				// Handle Work error error
				done(workDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Work.remove().exec();
		done();
	});
});