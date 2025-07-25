Here is the converted Node.js Express controller based on the provided Java Spring Boot controller:

```javascript
const express = require('express');
const router = express.Router();
const Actor = require('../models/Actor'); // Assuming Actor model is defined

/**
 * Get actors based on filters.
 * @route GET /actors
 * @param {string} req.query.firstName - First name filter
 * @param {string} req.query.lastName - Last name filter
 * @returns {Array} List of actors
 */
router.get('/actors', async (req, res) => {
    try {
        const { firstName = 'ALL ACTORS', lastName = 'ALL ACTORS' } = req.query;
        let actors;

        if (firstName === 'ALL ACTORS' && lastName === 'ALL ACTORS') {
            actors = await Actor.getAllActors();
        } else if (lastName === 'ALL ACTORS') {
            actors = await Actor.getActorsByFirstName(firstName);
        } else if (firstName === 'ALL ACTORS') {
            actors = await Actor.getActorsByLastName(lastName);
        } else {
            actors = await Actor.getActorsByFullName(firstName, lastName);
        }

        res.status(200).json({ actors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * Get actor details including films.
 * @route GET /actors/details
 * @param {number} req.query.id - Actor ID
 * @returns {Object} Actor details with films
 */
router.get('/actors/details', async (req, res) => {
    try {
        const { id } = req.query;
        const actorName = await Actor.getActorFullNameFromID(id);
        const films = await Actor.getFilmsByActor(id);

        res.status(200).json({ name: actorName, films });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
```

In this Node.js Express controller:
- Routes are defined using Express router.
- JSDoc comments are added for each route function.
- Async/await is used for asynchronous database operations.
- Proper error handling is implemented with appropriate HTTP status codes.
- The assumption is made that the Actor model with necessary methods like `getAllActors`, `getActorsByFirstName`, `getActorsByLastName`, `getActorsByFullName`, `getActorFullNameFromID`, and `getFilmsByActor` is defined elsewhere in the project.

Make sure to replace the assumptions with actual implementations based on your project structure and database operations.