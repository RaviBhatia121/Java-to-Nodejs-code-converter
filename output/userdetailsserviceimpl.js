To convert the given Java Spring service into a Node.js module, we will use the `bcrypt` library for password encoding and a mock database access to simulate the repository behavior. We will also use `async/await` for asynchronous operations and include proper error handling. Here's how you can achieve this:

```javascript
const bcrypt = require('bcrypt');
const { getCustomerByEmail, getStaffByUsername } = require('./repositories'); // Mocked repository functions

/**
 * @typedef {Object} UserDetails
 * @property {string} username - The username of the user.
 * @property {string} password - The encoded password of the user.
 * @property {string[]} roles - The roles assigned to the user.
 */

/**
 * Loads user details by username.
 * @param {string} anyUsername - The username to search for.
 * @returns {Promise<UserDetails>} The user details.
 * @throws {Error} If the user is not found.
 */
async function loadUserByUsername(anyUsername) {
    try {
        const customer = await getCustomerByEmail(anyUsername);
        const staff = await getStaffByUsername(anyUsername);

        if (!customer && !staff) {
            throw new Error('Could not find user');
        }

        const userDetails = {
            username: anyUsername,
            password: '',
            roles: []
        };

        if (staff) {
            userDetails.password = await bcrypt.hash(staff.password, 10);
            userDetails.roles.push('ADMIN');
        } else {
            userDetails.password = await bcrypt.hash(String(customer.customerId), 10);
            userDetails.roles.push('USER');
        }

        return userDetails;
    } catch (error) {
        throw new Error(`Error loading user by username: ${error.message}`);
    }
}

module.exports = {
    loadUserByUsername
};
```

### Explanation:

1. **Dependencies**: We use the `bcrypt` library for password hashing, which is similar to `BCryptPasswordEncoder` in Java.

2. **Repositories**: The `getCustomerByEmail` and `getStaffByUsername` functions are assumed to be asynchronous functions that interact with a database or data source to retrieve customer and staff information. You need to implement these functions in the `repositories.js` file or wherever your data access logic resides.

3. **Error Handling**: We use try-catch blocks to handle errors that may occur during the asynchronous operations.

4. **UserDetails Object**: We define a `UserDetails` object to mimic the `UserDetails` interface in Java, containing `username`, `password`, and `roles`.

5. **Password Hashing**: We use `bcrypt.hash` to encode passwords, similar to how `BCryptPasswordEncoder` works in Java.

This Node.js module provides a similar functionality to the Java service, allowing you to load user details by username with proper error handling and asynchronous operations.