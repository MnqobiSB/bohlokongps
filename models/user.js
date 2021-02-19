const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstName: { type: String, required: true, maxlength: 150 },
		lastName: { type: String, required: true, maxlength: 150 },
		email: { type: String, unique: true, required: true, maxlength: 150 },
		image: {
			secure_url: {
				type: String,
				default: '/images/default-profile.png'
			},
			public_id: String
		},
		isAdmin: {
			type: Boolean,
			default: false
		},
		isStaff: {
			type: Boolean,
			default: false
		},
		agreeToTerms: {
			type: Boolean,
			default: false,
			required: true
		},
		resetPasswordToken: String,
		resetPasswordExpires: Date
	},
	{ timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
