const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
	res.redirect('http://designplox.com/github/')
})

module.exports = router
