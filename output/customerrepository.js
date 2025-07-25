To convert the given Java Spring Data repository into a Node.js module, we can use a combination of a database client like `pg` for PostgreSQL or `mysql2` for MySQL, along with an ORM like `Sequelize` or a query builder like `Knex.js`. For this example, I'll use `pg` with `node-postgres` to directly execute SQL queries, which is more similar to the native query approach in your Java code.

Here's how you can implement the equivalent functionality in Node.js:

```javascript
// customerRepository.js

const { Pool } = require('pg');

// Configure the database connection
const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432, // default port for PostgreSQL
});

/**
 * Get a customer by their credentials.
 * @param {string} username - The email of the customer.
 * @param {number} password - The customer ID used as a password.
 * @returns {Promise<Object|null>} The customer object or null if not found.
 */
async function getCustomerByCredentials(username, password) {
  const query = 'SELECT * FROM customer WHERE email = $1 AND customer_id = $2';
  const values = [username, password];
  const res = await pool.query(query, values);
  return res.rows[0] || null;
}

/**
 * Get a customer by their username (email).
 * @param {string} username - The email of the customer.
 * @returns {Promise<Object|null>} The customer object or null if not found.
 */
async function getCustomerByUsername(username) {
  const query = 'SELECT * FROM customer WHERE email = $1';
  const res = await pool.query(query, [username]);
  return res.rows[0] || null;
}

/**
 * Get customers by their first name.
 * @param {string} firstName - The first name of the customers.
 * @returns {Promise<Array<Object>>} A list of customer objects.
 */
async function getCustomersByFirstName(firstName) {
  const query = 'SELECT * FROM customer WHERE first_name = $1';
  const res = await pool.query(query, [firstName]);
  return res.rows;
}

/**
 * Get customers by their last name.
 * @param {string} lastName - The last name of the customers.
 * @returns {Promise<Array<Object>>} A list of customer objects.
 */
async function getCustomersByLastName(lastName) {
  const query = 'SELECT * FROM customer WHERE last_name = $1';
  const res = await pool.query(query, [lastName]);
  return res.rows;
}

/**
 * Get customers by their full name.
 * @param {string} firstName - The first name of the customers.
 * @param {string} lastName - The last name of the customers.
 * @returns {Promise<Array<Object>>} A list of customer objects.
 */
async function getCustomersByFullName(firstName, lastName) {
  const query = 'SELECT * FROM customer WHERE first_name = $1 AND last_name = $2';
  const res = await pool.query(query, [firstName, lastName]);
  return res.rows;
}

/**
 * Get a customer by their customer ID.
 * @param {number} id - The ID of the customer.
 * @returns {Promise<Object|null>} The customer object or null if not found.
 */
async function getCustomerByCustomerId(id) {
  const query = 'SELECT * FROM customer WHERE customer_id = $1';
  const res = await pool.query(query, [id]);
  return res.rows[0] || null;
}

/**
 * Get a customer by their email.
 * @param {string} email - The email of the customer.
 * @returns {Promise<Object|null>} The customer object or null if not found.
 */
async function getCustomerByEmail(email) {
  const query = 'SELECT * FROM customer WHERE email = $1';
  const res = await pool.query(query, [email]);
  return res.rows[0] || null;
}

/**
 * Get the total count of customers.
 * @returns {Promise<number>} The total number of customers.
 */
async function getCustomerCount() {
  const query = 'SELECT COUNT(*) FROM customer';
  const res = await pool.query(query);
  return parseInt(res.rows[0].count, 10);
}

module.exports = {
  getCustomerByCredentials,
  getCustomerByUsername,
  getCustomersByFirstName,
  getCustomersByLastName,
  getCustomersByFullName,
  getCustomerByCustomerId,
  getCustomerByEmail,
  getCustomerCount,
};
```

### Notes:
- Replace `'your_db_user'`, `'your_db_host'`, `'your_db_name'`, and `'your_db_password'` with your actual database credentials.
- This code uses `pg` to connect to a PostgreSQL database. If you're using a different database, you might need to adjust the connection and query syntax accordingly.
- The `async/await` syntax is used to handle asynchronous database operations.
- JSDoc comments are added for each function to describe their purpose and parameters.