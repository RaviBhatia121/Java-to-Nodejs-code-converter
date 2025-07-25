const express = require('express');
const router = express.Router();
const staffRepo = require('./staffRepository');
const customerRepo = require('./customerRepository');
const inventoryRepo = require('./inventoryRepository');

/**
 * Get current user details along with customer and inventory counts.
 * @route GET /owner
 * @returns {Object} 200 - An object containing staff, customer count, and inventory count
 * @returns {Error} 404 - Staff not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/owner', async (req, res) => {
  try {
    const username = req.user.username; // Assuming req.user is set by auth middleware
    const staff = await staffRepo.getStaffByUsername(username);
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    const customerCount = await customerRepo.getCustomerCount();
    const inventoryCount = await inventoryRepo.getInventoryCount();
    res.json({ staff, customers: customerCount, inventory: inventoryCount });
  } catch (error) {
    console.error('Error fetching owner data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;