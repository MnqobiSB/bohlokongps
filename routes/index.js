const express = require('express');
const router = express.Router();
const { landingPage } = require('../controllers');
const { asyncErrorHandler } = require('../middleware');

// Front-End Routes

/* GET home page. */
// router.get('/', function (req, res, next) {
// 	res.render('index', { title: 'Express' });
// });

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

// GET /about
router.get('/about', (req, res) => {
	res.send('Welocome to the About Us Page');
});
// Get /staff
router.get('/staff', (req, res) => {
	res.send('Welocome to the Staff Page');
});
// GET /gallery
router.get('/gallery', (req, res) => {
	res.send('Welocome to the Gallery Page');
});
// GET /calender
router.get('/calenda', (req, res) => {
	res.send('Welocome to the Calenda Page');
});
// GET /documents
router.get('/documents', (req, res) => {
	res.send('Welocome to the Documents Page');
});

module.exports = router;
