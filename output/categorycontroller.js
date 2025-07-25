To convert the given Java Spring Boot controller into a Node.js Express controller, we will create an Express Router, validate path parameters, and handle errors appropriately. Below is the converted code:

```javascript
const express = require('express');
const router = express.Router();
const categoryService = require('./services/categoryService');
const filmService = require('./services/filmService');

/**
 * @route GET /categories
 * @desc Get all categories
 * @access Public
 */
router.get('/categories', async (req, res) => {
  try {
    const allCategories = await categoryService.getAllCategories();
    res.json({ allCategories });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /categories/details
 * @desc Get category details by ID
 * @access Public
 */
router.get('/categories/details', async (req, res) => {
  const id = parseInt(req.query.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  try {
    const category = await categoryService.getByCategoryId(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const films = await filmService.getFilmsByCategory(id);
    res.json({ category, films });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
```

### Key Points:
- **Express Router**: We use `express.Router()` to create a modular, mountable route handler.
- **Path Parameter Validation**: We use `parseInt` to convert the `id` query parameter to an integer and check if it's a valid number using `isNaN`.
- **Error Handling**: We return JSON error messages for invalid input (400), not found (404), and internal server errors (500).
- **Service Layer**: We assume the existence of `categoryService` and `filmService` modules with methods `getAllCategories`, `getByCategoryId`, and `getFilmsByCategory`.

This code assumes that the service modules (`categoryService` and `filmService`) are implemented and provide the necessary data access methods.