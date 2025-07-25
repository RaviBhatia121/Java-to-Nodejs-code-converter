To convert the given Java Spring Boot controller into a Node.js Express controller, we need to follow the requirements and structure the code accordingly. Below is the converted code:

```javascript
const express = require('express');
const router = express.Router();
const actorRepo = require('./actorRepo'); // Assuming actorRepo has the necessary functions

/**
 * Get current user details along with customer and inventory counts.
 * @route GET /owner
 * @returns {Object} 200 - An object containing staff, customer count, and inventory count
 * @returns {Error} 500 - Internal server error
 */
router.get('/owner', async (req, res) => {
  try {
    const username = req.user.username; // Assuming req.user is populated with the authenticated user's details
    const staff = await actorRepo.getStaffByUsername(username);
    const customerCount = await actorRepo.getCustomerCount();
    const inventoryCount = await actorRepo.getInventoryCount();

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({
      staff,
      customers: customerCount,
      inventory: inventoryCount
    });
  } catch (error) {
    console.error('Error fetching owner data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

### Key Points:
- **Express Router**: We use `express.Router()` to create a new router instance.
- **Path Params Validation**: Not applicable here as there are no path parameters in the `/owner` route.
- **Error Handling**: Proper JSON error messages are returned for 404 (not found) and 500 (internal server error).
- **Repository Module**: Assumed to be `actorRepo` with functions `getStaffByUsername`, `getCustomerCount`, and `getInventoryCount`.
- **JSDoc Comments**: Added for the route to describe its functionality and possible responses.

### Assumptions:
- The `req.user` object contains the authenticated user's details, including the `username`.
- The `actorRepo` module has the necessary functions to interact with the data source, similar to the services in the Java code.