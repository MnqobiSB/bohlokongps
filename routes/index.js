var express = require('express');
var router = express.Router();

// Front-End Routes

/* GET home page. */
// router.get('/', function (req, res, next) {
// 	res.render('index', { title: 'Express' });
// });

// GET / landing page
router.get('/', (req, res) => {
	res.send('Welocome to the Home Page');
});
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
