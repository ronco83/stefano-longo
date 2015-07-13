'use strict';


var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'longo.stefano.83@gmail.com',
		pass: 'Neronegmail1883!'
	}
});

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};


exports.sendMail = function(req, res) {
	var data = req.body;
	transporter.sendMail({
		to: 'longo.stefano.83@gmail.com',
		subject: data.contactSubject,
		text: "From " + data.contactName + "<br/>" + data.contactEmail + "<br/><br/>Message:<br/>" + data.contactMessage
	});
	res.json(data)
};
