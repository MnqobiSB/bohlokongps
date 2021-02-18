const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema(
	{
		title: String,
		createdAt: {
			type: Date,
			default: Date.now
		},
		images: [
			{
				url: String,
				public_id: String
			}
		],
		homeArticle: {
			type: Boolean,
			default: false
		},
		category: String,
		body: String,
		read: {
			type: Number,
			min: 1,
			max: 15,
			validate: {
				validator: Number.isInteger,
				message: '{VALUE} is not an integer value.'
			}
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
);

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);
