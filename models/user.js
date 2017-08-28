const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	identifier: String,
	email: String,
	username: String,
	notifications: {
		default: true,
		type: Boolean
	},
	device: {
		default: {
			platform: 'web'
		},
		type: mongoose.Schema.Types.Mixed
	},
	token: {
		index: true,
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
})

const model = mongoose.model('User', schema)

module.exports = model
