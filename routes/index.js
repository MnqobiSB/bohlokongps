const express = require('express');
const router = express.Router();
const { landingPage, postContact } = require('../controllers');
const { asyncErrorHandler } = require('../middleware');

// Index Routes

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

// GET /about
router.get('/about-us', (req, res) => {
	res.render('about', {
		title: 'About Us',
		page: 'about'
	});
});
// Get /staff
router.get('/staff', (req, res) => {
	res.render('staff', {
		title: 'Meet The Staff',
		page: 'staff'
	});
});
// GET /gallery
router.get('/gallery', (req, res) => {
	res.render('gallery', {
		title: 'Our Gallery',
		page: 'gallery'
	});
});
// GET /calender
router.get('/calendar', (req, res) => {
	res.render('calendar', {
		title: 'School Calendar',
		page: 'calendar'
	});
});
// GET /documents
router.get('/documents', (req, res) => {
	res.render('documents', {
		title: 'Available Documents',
		page: 'documents'
	});
});
// GET /contact
router.get('/contact', (req, res) => {
	res.render('contact', {
		title: 'Contact Us',
		page: 'contact'
	});
});

/* POST /contact */
router.post('/contact', asyncErrorHandler(postContact));

module.exports = router;
