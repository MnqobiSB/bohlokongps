const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {
	getSignup,
	postSignup,
	getSignin,
	postSignin,
	getSignout,
	getProfile,
	updateProfile,
	getForgotPw,
	putForgotPw,
	getReset,
	putReset
} = require('../controllers');
const {
	asyncErrorHandler,
	isLoggedIn,
	isValidPassword,
	changePassword
} = require('../middleware');

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /signin */
router.get('/signup', getSignup);

/* POST /signin */
router.post('/signup', upload.single('image'), asyncErrorHandler(postSignup));

/* GET /login */
router.get('/signin', getSignin);

/* POST /login */
router.post('/signin', asyncErrorHandler(postSignin));

/* GET /logout */
router.get('/signout', getSignout);

/* GET /profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT /profile */
router.put(
	'/profile',
	isLoggedIn,
	upload.single('image'),
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);

/* GET /forgot */
router.get('/forgot-password', getForgotPw);

/* PUT /forgot */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET /reset/:token */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT /reset/:token */
router.put('/reset/:token', asyncErrorHandler(putReset));

module.exports = router;
