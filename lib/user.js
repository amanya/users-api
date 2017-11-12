const { pool } = require('./database')

function User() {
	this.fields = {}
}

User.prototype.pool = pool

User.prototype._performQuery = function(query, params) {
	return new Promise((resolve, reject) => {
		this.pool.connect()
			.then(client => {
				client.query(query, params)
					.then(res => {
						client.release()
						resolve(res.rows)
					})
					.catch(err => {
						client.release()
						reject(`Unable to perform query: ${err}`)
					})
			})
			.catch(err => {
				reject(`Error connecting to the db: ${err}`)
			})
	})
}

User.prototype.findAll = function() {
	const query = 'SELECT * FROM users'
	return this._performQuery(query)
}

User.prototype.findOne = function(userId) {
	const query = 'SELECT * FROM users WHERE id=$1'
	const params = [userId]
	return this._performQuery(query, params)
		.then(res => {
			return new Promise((resolve, reject) => {
				if(res.length > 0) {
					resolve(res[0])
				} else {
					reject(`User with id ${userId} not found`)
				}
			})
		})
}

User.prototype.update = function(userId) {
	return this.findOne(userId)
		.then(user => {
			const query = 'UPDATE users SET name=$1 WHERE id=$2 RETURNING *'
			const params = [this.fields.name, userId]
			return this._performQuery(query, params)
				.then(res => {
					return new Promise((resolve, reject) => {
						resolve(res[0])
					})
				})
		})
}

User.prototype.delete = function(userId) {
	return this.findOne(userId)
		.then(user => {
			const query = 'DELETE FROM users WHERE id=$1'
			const params = [userId]
			return this._performQuery(query, params)
				.then(res => {
					return new Promise((resolve, reject) => {
						resolve(res)
					})
				})
		})
}

User.prototype.save = function() {
	const query = 'INSERT INTO users(name) VALUES ($1) RETURNING *'
	const params = [this.fields.name]
	return this._performQuery(query, params)
}

module.exports = User
