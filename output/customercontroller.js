To convert the given Java Spring Boot controller into a Node.js Express controller, we will use Express Router, validate path parameters, and return appropriate JSON error messages. Below is the converted code:

```javascript
const express = require('express');
const router = express.Router();
const actorRepo = require('./actorRepo'); // Assuming actorRepo is the repository module

// Mock services to simulate the behavior of the Java services
const customerService = require('./services/customerService');
const rentalService = require('./services/rentalService');
const inventoryService = require('./services/inventoryService');
const filmService = require('./services/filmService');

/**
 * Get current user details and their orders.
 * @route GET /customer
 */
router.get('/customer', async (req, res) => {
  try {
    const email = req.user.email; // Assuming req.user contains authenticated user info
    const customer = await customerService.getCustomerByEmail(email);
    const ordersList = [];

    if (customer) {
      const customersRentals = await rentalService.getRentalsByCustomer(customer.customerId);
      for (const rental of customersRentals) {
        const inventory = await inventoryService.getInventoriesById(rental.inventoryId);
        const film = await filmService.getFilmByID(inventory.filmId);
        const order = { customer, film, rental };
        ordersList.push(order);
      }
    }

    res.json({ orders: ordersList, customer });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Get customers with optional name filters.
 * @route GET /owner/customers
 */
router.get('/owner/customers', async (req, res) => {
  try {
    const firstNameFilter = req.query.firstName || 'ALL CUSTOMERS';
    const lastNameFilter = req.query.lastName || 'ALL CUSTOMERS';
    let customers;

    if (firstNameFilter === 'ALL CUSTOMERS' && lastNameFilter === 'ALL CUSTOMERS') {
      customers = await customerService.getAllCustomers();
    } else if (lastNameFilter === 'ALL CUSTOMERS') {
      customers = await customerService.getCustomersByFirstName(firstNameFilter);
    } else if (firstNameFilter === 'ALL CUSTOMERS') {
      customers = await customerService.getCustomersByLastName(lastNameFilter);
    } else {
      customers = await customerService.getCustomersByFullName(firstNameFilter, lastNameFilter);
    }

    res.json({ customers, allCustomers: await customerService.getAllCustomers() });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Show user's rental history by customer ID.
 * @route GET /owner/view/customers/:id
 */
router.get('/owner/view/customers/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  try {
    const customer = await customerService.getCustomerByID(id);
    const ordersList = [];

    if (customer) {
      const customersRentals = await rentalService.getRentalsByCustomer(id);
      for (const rental of customersRentals) {
        const inventory = await inventoryService.getInventoriesById(rental.inventoryId);
        const film = await filmService.getFilmByID(inventory.filmId);
        const order = { customer, film, rental };
        ordersList.push(order);
      }
    }

    res.json({ history: ordersList, customer });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
```

### Key Points:
- **Express Router**: Used to define routes.
- **Path Parameter Validation**: `parseInt` and `isNaN` are used to validate path parameters.
- **Error Handling**: JSON error messages are returned for invalid input (400), not found (404), and internal server errors (500).
- **Service Layer**: Assumed to be implemented similarly to the Java services, providing methods like `getCustomerByEmail`, `getRentalsByCustomer`, etc.
- **Authentication**: Assumed `req.user` contains the authenticated user's email for the `/customer` route. Adjust as necessary based on your authentication setup.