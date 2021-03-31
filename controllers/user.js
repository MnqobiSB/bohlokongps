const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports = {
	// GET /Signup
	getSignup (req, res, next) {
		res.render('user/signup', {
			title: 'Sign Up',
			username: '',
			email: ''
		});
	},
	// POST /register
	async postSignup (req, res, next) {
		try {
			if (req.file) {
				const { secure_url, public_id } = req.file;
				req.body.image = { secure_url, public_id };
			}
			const user = await User.register(
				new User(req.body),
				req.body.password
			);
			req.login(user, function (err) {
				if (err) return next(err);
				req.session.success = `Welcome to Bohlokong Primary School, ${user.username}!`;
				res.redirect('/');
			});
		} catch (err) {
			deleteProfileImage(req);
			const { username, email } = req.body;
			let error = err.message;
			if (
				error.includes('E11000 duplicate key error') &&
				error.includes('index: email_1 dup key')
			) {
				error = 'A user with the given email is already registered!';
			}
			res.render('user/signup', {
				title: 'Sign In',
				username,
				email,
				error
			});
		}
	},
	// GET /signin
	getSignin (req, res, next) {
		if (req.isAuthenticated()) return res.redirect('/');
		if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
		res.render('user/signin', { title: 'Sign In' });
	},
	// POST /signin
	async postSignin (req, res, next) {
		const { username, password } = req.body;
		const { user, error } = await User.authenticate()(username, password);
		if (!user && error) return next(error);
		req.login(user, function (err) {
			if (err) return next(err);
			req.session.success = `Welcome back, ${username}!`;
			const redirectUrl = req.session.redirectTo || '/';
			delete req.session.redirectTo;
			res.redirect(redirectUrl);
		});
	},
	// GET /logout
	getSignout (req, res, next) {
		req.logout();
		res.redirect('/');
	},
	// GET /profile
	async getProfile (req, res, next) {
		const posts = await Post.find()
			.where('author')
			.equals(req.user._id)
			.limit(10)
			.exec();
		res.render('profile', { posts });
	},
	// PUT /profile
	async updateProfile (req, res, next) {
		const { username, email } = req.body;
		const { user } = res.locals;
		if (username) user.username = username;
		if (email) user.email = email;
		if (req.file) {
			if (user.image.public_id)
				await cloudinary.v2.uploader.destroy(user.image.public_id);
			const { secure_url, public_id } = req.file;
			user.image = { secure_url, public_id };
		}
		await user.save();
		const login = util.promisify(req.login.bind(req));
		await login(user);
		req.session.success = 'Profile successfully updated!';
		res.redirect('/profile');
	},
	// GET /users/forgot
	getForgotPw (req, res, next) {
		res.render('users/forgot');
	},
	// PUT /users/forgot
	async putForgotPw (req, res, next) {
		const token = await crypto.randomBytes(20).toString('hex');
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			req.session.error = 'No account with that email.';
			return res.redirect('/forgot-password');
		}
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000;
		await user.save();

		const smtpTransport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'amandlamm1@gmail.com',
				pass: process.env.GMAILPW
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		const msg = {
			to: email,
			from: '"Skate Shop Admin" <amandlamm1@gmail.com>',
			subject: 'Skate Shop - Forgot Password / Reset',
			text:
				'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' +
				req.headers.host +
				'/reset/' +
				token +
				'\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			// html: '<strong>and easy to do anywhere, even with Node.js</strong>',
		};
		await smtpTransport.sendMail(msg);

		req.session.success = `An email has been sent to ${email} with further instructions.`;
		res.redirect('/forgot-password');
	},
	// GET /users/reset
	async getReset (req, res, next) {
		const { token } = req.params;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		});

		if (!user) {
			req.session.error =
				'Password reset token is invalid or has expired.';
			return res.redirect('/forgot-password');
		}

		res.render('users/reset', { token });
	},
	// PUT /users/reset
	async putReset (req, res, next) {
		const { token } = req.params;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		});

		if (!user) {
			req.session.error =
				'Password reset token is invalid or has expired!';
			return res.redirect('/forgot-password');
		}

		if (req.body.password === req.body.confirm) {
			await user.setPassword(req.body.password);
			user.resetPasswordToken = null;
			user.resetPasswordExpires = null;
			await user.save();
			const login = util.promisify(req.login.bind(req));
			await login(user);
		} else {
			req.session.error = 'Passwords do not match!';
			return res.redirect(`/reset/${token}`);
		}

		const smtpTransport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'amandlamm1@gmail.com',
				pass: process.env.GMAILPW
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		const msg = {
			to: user.email,
			from: '"Skate Shop Admin" <amandlamm1@gmail.com>',
			subject: 'Skate Shop - Password Reset successful!',
			text: `Hello,
		  	This email is to confirm that the password for your account has just been changed.
		  	If you did not make this change, please hit reply and notify us at once.`.replace(
				/		  	/g,
				''
			)
		};

		await smtpTransport.sendMail(msg);

		req.session.success = 'Password reset successful!';
		res.redirect('/');
	}
};
