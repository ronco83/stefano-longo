'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var works = require('../../app/controllers/works.server.controller');

	// Works Routes
	app.route('/works')
		.get(works.list)
		.post(users.requiresLogin, works.create);

	app.route('/works/:workId')
		.get(works.read)
		.put(users.requiresLogin, works.hasAuthorization, works.update)
		.delete(users.requiresLogin, works.hasAuthorization, works.delete);

	// Finish by binding the Work middleware
	app.param('workId', works.workByID);
};
