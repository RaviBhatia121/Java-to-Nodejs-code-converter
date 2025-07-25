To convert the given Java Spring Boot controller into a Node.js Express controller, we will use Express Router and assume the existence of a repository module (e.g., `actorRepo`) with functions that match the service methods used in the Java code. We will also handle path parameter validation and return appropriate JSON error messages.

Here's how the converted Node.js Express controller might look:

```javascript
const express = require('express');
const router = express.Router();
const actorRepo = require('./actorRepo'); // Assume this module provides necessary functions
const filmRepo = require('./filmRepo'); // Assume this module provides necessary functions

/**
 * @route GET /actors
 * @param {string} [firstName] - Optional first name filter
 * @param {string} [lastName] - Optional last name filter
 * @returns {Object} JSON response with actors list
 */
router.get('/actors', async (req, res) => {
  try {
    const firstNameFilter = req.query.firstName || 'ALL ACTORS';
    const lastNameFilter = req.query.lastName || 'ALL ACTORS';
    let actors;

    if (firstNameFilter === 'ALL ACTORS' && lastNameFilter === 'ALL ACTORS') {
      actors = await actorRepo.getAllActors();
    } else if (lastNameFilter === 'ALL ACTORS') {
      actors = await actorRepo.getActorsByFirstName(firstNameFilter);
    } else if (firstNameFilter === 'ALL ACTORS') {
      actors = await actorRepo.getActorsByLastName(lastNameFilter);
    } else {
      actors = await actorRepo.getActorsByFullName(firstNameFilter, lastNameFilter);
    }

    res.json({
      actors,
      allActors: await actorRepo.getAllActors()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /actors/details
 * @param {number} id - Actor ID
 * @returns {Object} JSON response with actor details
 */
router.get('/actors/details', async (req, res) => {
  const id = parseInt(req.query.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const actorName = await actorRepo.getActorFullNameFromID(id);
    const films = await filmRepo.getFilmsByActor(id);

    if (!actorName) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    res.json({
      name: actorName,
      films
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
```

### Key Points:
- **Express Router**: We use `express.Router()` to create a modular, mountable route handler.
- **Path Parameter Validation**: We use `parseInt` and `isNaN` to validate the `id` parameter.
- **Error Handling**: We return JSON error messages for invalid input (400), not found (404), and internal server errors (500).
- **Repository Module**: We assume the existence of `actorRepo` and `filmRepo` modules that provide the necessary data access functions.
- **JSDoc Comments**: We add JSDoc comments to describe the routes and parameters.