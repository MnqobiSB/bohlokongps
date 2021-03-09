const Post = require('../models/post');

module.exports = {
	// GET / landing page
	async landingPage (req, res, next) {
		const posts = await Post.find({});
		res.render('index', {
			posts,
			page: 'home',
			title: 'Bohlokong Primary School - Welcome!'
		});
	}
};
