const { Pool, Query } = require('pg')

var actualSubmit = Query.prototype.submit;

Query.prototype.submit = function() {
	console.log(this.text, this.values);
	actualSubmit.apply(this, arguments);
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL || 'postgres://users_api:asdf@localhost:5432/users_api'
})

module.exports = { pool: pool }
