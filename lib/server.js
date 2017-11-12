const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const User = require('./user')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 8080

const router = express.Router()

router.use((req, res, next) => {
	next()
})

router.route('/users')
	.post((req, res) => {
		const fields = {
			name: req.body.name
		}
		var user = new User()
		user.fields = fields
		user.save()
			.then(user => {
				res.json(user)
			})
			.catch(err => {
				res.json({ message: err })
			})
	})
	.get((req, res) => {
		User.prototype.findAll()
			.then(users => {
				res.json(users)
			})
			.catch(err => {
				res.json({ message: err })
			})
	})

router.route('/users/:userId')
	.get((req, res) => {
		User.prototype.findOne(req.params.userId)
			.then(user => {
				res.json(user)
			})
			.catch(err => {
				res.json({ message: err })
			})
	})
	.put((req, res) => {
		const fields = {
			name: req.body.name
		}
		var user = new User()
		user.fields = fields
		user.update(req.params.userId)
			.then(user => {
				res.json(user)
			})
			.catch(err => {
				res.json({ message: err })
			})
	})
	.delete((req, res) => {
		User.prototype.delete(req.params.userId)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json({ message: err })
			})
	})

router.get('/', (req, res) => {
	res.json({ message: 'howdy!' })
})

app.use('/api', router)

app.listen(port)
console.log('Server running on port ' + port)
