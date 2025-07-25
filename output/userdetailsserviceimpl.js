Here is the converted Node.js service module based on the provided Java Spring Boot service class:

Node.js code:
```javascript
const bcrypt = require('bcrypt');
const { CustomerRepository, StaffRepository } = require('./repositories');

/**
 * Service module for user details operations.
 * @module UserDetailsServiceImpl
 */

/**
 * Load user details by username.
 * @param {string} anyUsername - The username to load user details for.
 * @returns {Promise<Object>} The user details object.
 * @throws {Error} If user is not found.
 */
async function loadUserByUsername(anyUsername) {
    try {
        const customer = await CustomerRepository.getCustomerByEmail(anyUsername);
        const staff = await StaffRepository.getStaffByUsername(anyUsername);

        if (!customer && !staff) {
            throw new Error('Could not find user');
        }

        let builder;
        if (staff) {
            builder = {
                username: anyUsername,
                password: await bcrypt.hash(staff.password, 10),
                roles: ['ADMIN']
            };
        } else {
            builder = {
                username: anyUsername,
                password: await bcrypt.hash(String(customer.customerId), 10),
                roles: ['USER']
            };
        }

        return builder;
    } catch (error) {
        throw new Error(`Error loading user details: ${error.message}`);
    }
}

module.exports = {
    loadUserByUsername
};
```

In this Node.js service module:
- The `loadUserByUsername` function is exported to load user details by username.
- The function uses async/await for asynchronous operations and proper error handling.
- JSDoc comments are provided for documentation.
- Data validation is not explicitly shown here but should be implemented in the repository methods.
- The module uses modern JavaScript patterns and bcrypt for password hashing.
- The module exports the `loadUserByUsername` function for external use.

Make sure to implement the `CustomerRepository` and `StaffRepository` modules with the necessary database operations for fetching customer and staff data.