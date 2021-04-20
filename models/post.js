const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema(
	{
		title: String,
		description: String,
		images: [ { url: String, public_id: String } ],
		mainPost: {
			type: Boolean,
			default: false
		},
		featuredPost: {
			type: Boolean,
			default: false
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		createdAt: { type: Date, default: Date.now }
	},
	{
		timestamps: true
	}
);

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);
