'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Work = mongoose.model('Work'),
	_ = require('lodash');

/**
 * Create a Work
 */
exports.create = function(req, res) {
	var work = new Work(req.body);
	work.user = req.user;

	work.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(work);
		}
	});
};

/**
 * Show the current Work
 */
exports.read = function(req, res) {
	res.jsonp(req.work);
};

/**
 * Update a Work
 */
exports.update = function(req, res) {
	var work = req.work ;

	work = _.extend(work , req.body);

	work.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(work);
		}
	});
};

/**
 * Delete an Work
 */
exports.delete = function(req, res) {
	var work = req.work ;

	work.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(work);
		}
	});
};

/**
 * List of Works
 */

exports.list = function(req, res) {
	Work.find().sort('-created').populate('user', 'displayName').exec(function(err, works) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(works);
		}
	});
};

/**
 * Work middleware
 */
exports.workByID = function(req, res, next, id) { 
	Work.findById(id).populate('user', 'displayName').exec(function(err, work) {
		if (err) return next(err);
		if (! work) return next(new Error('Failed to load Work ' + id));
		req.work = work ;
		next();
	});
};

/**
 * Work authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.work.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
