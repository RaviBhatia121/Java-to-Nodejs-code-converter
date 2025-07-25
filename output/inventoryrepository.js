To convert the given Java Spring Data repository into a Node.js module, we will use a combination of a database client like `pg` for PostgreSQL or `mysql2` for MySQL, depending on your database. For this example, I'll assume you're using MySQL and the `mysql2` package. Here's how you can implement the equivalent functionality in Node.js:

```javascript
// inventoryRepository.js

const mysql = require('mysql2/promise');

/**
 * InventoryRepository class to handle database operations for Inventory.
 */
class InventoryRepository {
  /**
   * Creates an instance of InventoryRepository.
   * @param {Object} dbConfig - The database configuration object.
   */
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  /**
   * Establishes a connection to the database.
   * @returns {Promise<mysql.Connection>} The database connection.
   */
  async connect() {
    return await mysql.createConnection(this.dbConfig);
  }

  /**
   * Retrieves an inventory by its inventory ID.
   * @param {number} inventoryId - The ID of the inventory.
   * @returns {Promise<Object>} The inventory record.
   */
  async getInventoriesByInventoryId(inventoryId) {
    const connection = await this.connect();
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM inventory i 
         INNER JOIN rental r ON i.inventory_id = r.inventory_id 
         WHERE i.inventory_id = ?`,
        [inventoryId]
      );
      return rows[0];
    } finally {
      await connection.end();
    }
  }

  /**
   * Deletes inventory records by film ID.
   * @param {number} id - The film ID.
   * @returns {Promise<void>}
   */
  async deleteInventoryByInventoryId(id) {
    const connection = await this.connect();
    try {
      await connection.execute(
        `DELETE FROM inventory WHERE film_id = ?`,
        [id]
      );
    } finally {
      await connection.end();
    }
  }

  /**
   * Retrieves the total count of inventory records.
   * @returns {Promise<number>} The count of inventory records.
   */
  async getInventoryCount() {
    const connection = await this.connect();
    try {
      const [rows] = await connection.execute(
        `SELECT COUNT(*) AS count FROM inventory`
      );
      return rows[0].count;
    } finally {
      await connection.end();
    }
  }
}

module.exports = InventoryRepository;
```

### Explanation:

1. **Database Connection**: The `connect` method establishes a connection to the database using the `mysql2` package. This method is used internally by other methods to perform database operations.

2. **getInventoriesByInventoryId**: This method executes a SQL query to retrieve an inventory record by its ID, similar to the Java method.

3. **deleteInventoryByInventoryId**: This method deletes inventory records based on the film ID, similar to the Java method.

4. **getInventoryCount**: This method retrieves the total count of inventory records, similar to the Java method.

5. **JSDoc Comments**: Each method is documented with JSDoc comments to describe its purpose, parameters, and return values.

Make sure to replace `dbConfig` with your actual database configuration when creating an instance of `InventoryRepository`.