const express = require('express')

const User = require('../models/user')

const router = express.Router()

router.post('/', async (req, res, next) => {
	const user = new User(req.body)

	await user.save()

	res.send(user)
})

module.exports = router
