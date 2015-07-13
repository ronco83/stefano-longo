'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	URLSlugs = require('mongoose-url-slugs');

/**
 * Work Schema
 */
var WorkSchema = new Schema({
	projectName: {
		type: String,
		default: '',
		required: 'Please fill Work name',
		trim: true
	},
	projectShortDescription: {
		type: String,
		default: '',
		required: 'Please fill Work short description'
	},
	projectShortDescriptionen: {
		type: String,
		default: '',
		required: 'Please fill Work short description'
	},
	projectDescription: {
		type: Schema.Types.Mixed,
		default: '',
		required: 'Please fill Work description'
	},
	projectDescriptionen: {
		type: Schema.Types.Mixed,
		default: '',
		required: 'Please fill Work description'
	},
	projectSliderImg: {
		type: String,
		default: '',
		required: 'Please insert sliderImg'
	},
	projectImages: {
		type: [String],
		index: true,
		default: '',
		required: 'required'
	},
	projectOrder: {
		type: Number,
		index: true,
		default: '',
		required: 'required'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

WorkSchema.plugin(URLSlugs('projectName projectDescription'));

mongoose.model('Work', WorkSchema);
