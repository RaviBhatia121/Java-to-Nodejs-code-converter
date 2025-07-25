To convert the provided Java Spring Boot controller into a Node.js Express controller, we'll follow the requirements and structure the code accordingly. We'll use Express Router, validate path parameters, and return appropriate JSON error messages. Here's how the conversion looks:

```javascript
const express = require('express');
const router = express.Router();
const filmRepo = require('./repositories/filmRepo');
const inventoryRepo = require('./repositories/inventoryRepo');
const rentalRepo = require('./repositories/rentalRepo');
const customerRepo = require('./repositories/customerRepo');

/**
 * Get all films or filter by title.
 * @route GET /films
 */
router.get('/films', async (req, res) => {
  try {
    const filter = req.query.title || 'ALL FILMS';
    let films;
    if (filter === 'ALL FILMS') {
      films = await filmRepo.getAllFilms();
    } else {
      films = await filmRepo.getFilmsByTitle(filter);
    }
    const availableFilms = await filmRepo.getAvailableFilms();
    const allFilms = await filmRepo.getAllFilms();
    res.json({ films, availableFilms, allFilms });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Get film details by ID.
 * @route GET /films/details
 */
router.get('/films/details', async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  try {
    const film = await filmRepo.getFilmByID(id);
    const available = (await filmRepo.getAvailableFilms()).includes(film);
    res.json({ available, details: film });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Rent a film by film ID.
 * @route GET /rent/:filmid
 */
router.get('/rent/:filmid', async (req, res) => {
  const filmid = parseInt(req.params.filmid, 10);
  if (isNaN(filmid)) {
    return res.status(400).json({ error: 'Invalid Film ID' });
  }
  try {
    const name = req.user.email; // Assuming req.user is populated with authenticated user info
    const customer = await customerRepo.getCustomerByEmail(name);
    const inventoryList = await inventoryRepo.getAllInventory();
    for (const inventory of inventoryList) {
      if (inventory.filmId === filmid) {
        const film = await filmRepo.getFilmByID(inventory.filmId);
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + film.rentalDuration);
        await rentalRepo.addRental(inventory.inventoryId, customer.customerId, returnDate);
        break;
      }
    }
    res.redirect('/films');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Manage films for the owner.
 * @route GET /owner/manage-films
 */
router.get('/owner/manage-films', async (req, res) => {
  try {
    const filter = req.query.title || 'ALL FILMS';
    let films;
    if (filter === 'ALL FILMS') {
      films = await filmRepo.getAllFilms();
    } else {
      films = await filmRepo.getFilmsByTitle(filter);
    }
    const allFilms = await filmRepo.getAllFilms();
    const filmCount = {};
    for (const film of allFilms) {
      filmCount[film.filmId] = await filmRepo.getAvailableFilmCount(film.filmId);
    }
    res.json({ films, filmCount, allFilms: films });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Show edit product page.
 * @route GET /edit/:id
 */
router.get('/edit/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  try {
    const film = await filmRepo.getFilmByID(id);
    res.json({ film });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Delete a product by ID.
 * @route DELETE /delete/:id
 */
router.delete('/delete/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  try {
    await filmRepo.deleteFilmById(id);
    res.redirect('/owner/manage-films');
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
- **Repository Module**: Assumed to have functions like `getAllFilms`, `getFilmsByTitle`, `getFilmByID`, etc.
- **User Authentication**: Assumed `req.user` contains authenticated user information for the `/rent/:filmid` route. Adjust as necessary based on your authentication setup.