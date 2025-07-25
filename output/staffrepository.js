To convert the given Java Spring Data repository into a Node.js module, we can use a combination of a database client like `pg` for PostgreSQL or `mysql2` for MySQL, depending on your database. For this example, I'll assume you're using MySQL and will use the `mysql2` package. Here's how you can create a Node.js module with equivalent functionality:

First, ensure you have the `mysql2` package installed:

```bash
npm install mysql2
```

Now, create a Node.js module for the data access:

```javascript
// staffRepository.js

const mysql = require('mysql2/promise');

/**
 * Creates a connection to the database.
 * @returns {Promise<mysql.Connection>} A promise that resolves to the database connection.
 */
async function createConnection() {
  return mysql.createConnection({
    host: 'localhost', // replace with your database host
    user: 'root',      // replace with your database user
    password: 'password', // replace with your database password
    database: 'sakila' // replace with your database name
  });
}

/**
 * Retrieves a staff member by their username.
 * @param {string} username - The username of the staff member.
 * @returns {Promise<Object|null>} A promise that resolves to the staff member object or null if not found.
 */
async function getStaffByUsername(username) {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM staff WHERE username = ?',
      [username]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    await connection.end();
  }
}

module.exports = {
  getStaffByUsername
};
```

### Explanation:

1. **Database Connection**: The `createConnection` function establishes a connection to the MySQL database using the `mysql2` package. You need to replace the connection details with your actual database credentials.

2. **getStaffByUsername Function**: This function is equivalent to the `getStaffByUsername` method in the Java repository. It executes a SQL query to find a staff member by their username. The `?` in the query is a placeholder for the `username` parameter, which is safely substituted to prevent SQL injection.

3. **Error Handling**: The `try...finally` block ensures that the database connection is closed after the query is executed, even if an error occurs.

4. **Exporting Functions**: The `getStaffByUsername` function is exported from the module so it can be used in other parts of the application.

This Node.js module provides the same functionality as the Java repository, allowing you to retrieve a staff member by their username from the database.