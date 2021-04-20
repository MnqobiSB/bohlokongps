const Post = require('../models/post');
const nodemailer = require('nodemailer');

module.exports = {
	// GET / landing page
	async landingPage (req, res, next) {
		const posts = await Post.find({});
		res.render('index', {
			posts,
			page: 'home',
			title: 'Bohlokong Primary School - Welcome!'
		});
	},
	// POST /contact
	async postContact (req, res, next) {
		const userQueryData = `
		  	<h1>You Have a New Enquiry From User</h1>
		  	<h2>User Contact Details:</h2>
		  	<ul>
			    <li>Name: ${req.body.queryUsername}</li>
			    <li>Email: ${req.body.queryEmail}</li>
			    <li>Subjet: ${req.body.querySubject}</li>
		  	</ul>  
		  	<h3>Message</h3>
		  	<p>${req.body.queryMessage}</p>
	  	`;

		let smtpTransport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'amandlamm1@gmail.com',
				pass: process.env.GMAILPW
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		const mailOptions = {
			from: '"User/Parent - New Enquiry"',
			to: 'bohlokongps@telkomsa.net',
			subject: 'New Enquiry From School Website',
			html: userQueryData
		};

		await smtpTransport.sendMail(mailOptions);

		req.session.success = `Your enquiry has been successfully sent ${req
			.body.queryUsername}, a response will be sent to you soon!`;
		res.redirect('/contact');
	}
};
