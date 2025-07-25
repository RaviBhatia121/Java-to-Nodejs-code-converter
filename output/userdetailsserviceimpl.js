const bcrypt = require('bcrypt');
const CustomerRepository = require('./customerrepository');
const StaffRepository = require('./staffrepository');

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