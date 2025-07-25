To convert the given Java Spring Boot controller into a Node.js Express controller, we'll create an Express Router that handles the same routes. We'll also include basic error handling and validation as specified in the requirements. Since the original Java controller does not handle any path parameters or complex logic, the conversion will be straightforward.

Here's how you can implement it in Node.js using Express:

```javascript
const express = require('express');
const router = express.Router();

/**
 * @route GET /
 * @desc Render the home page
 * @access Public
 */
router.get('/', (req, res) => {
  try {
    // Assuming a function that renders the home page
    res.send('home');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /login
 * @desc Render the login page
 * @access Public
 */
router.get('/login', (req, res) => {
  try {
    // Assuming a function that renders the login page
    res.send('login');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /account
 * @desc Render the account page
 * @access Public
 */
router.get('/account', (req, res) => {
  try {
    // Assuming a function that renders the account page
    res.send('account');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
```

### Explanation:

- **Express Router**: We use `express.Router()` to create a modular, mountable route handler.
- **Routes**: Each route corresponds to a method in the Java controller. The routes are defined using `router.get()`.
- **Error Handling**: A try-catch block is used to handle any potential errors, returning a 500 status code with a JSON error message if an error occurs.
- **Export**: The router is exported at the end of the file so it can be used in the main application file.

This code assumes that the rendering of pages is done by sending a string response, similar to the Java controller's return of view names. If you have a templating engine or a different method of rendering views, you would replace `res.send('viewName')` with the appropriate rendering logic.