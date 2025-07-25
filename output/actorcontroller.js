
const express = require('express');
const router = express.Router();
const actorRepository = require('./actorrepository');

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
            // TODO: Implement getAllActors method in actorRepository
            // For now, we'll use findActorsByFirstName with a wildcard approach
            actors = await actorRepository.findActorsByFirstName('%'); // Placeholder
        } else if (lastName === 'ALL ACTORS') {
            actors = await actorRepository.findActorsByFirstName(firstName);
        } else if (firstName === 'ALL ACTORS') {
            actors = await actorRepository.findActorsByLastName(lastName);
        } else {
            actors = await actorRepository.findActorsByFirstNameAndLastName(firstName, lastName);
        }

        res.status(200).json({ actors });
    } catch (error) {
        console.error('Error fetching actors:', error);
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
        
        if (!id) {
            return res.status(400).json({ message: 'Actor ID is required' });
        }

        const actor = await actorRepository.getActorByActorId(parseInt(id));
        
        if (!actor) {
            return res.status(404).json({ message: 'Actor not found' });
        }

        // Construct full name from actor data
        const actorName = `${actor.first_name} ${actor.last_name}`;
        
        // TODO: Implement getFilmsByActor method in actorRepository
        // For now, return empty films array
        const films = []; // Placeholder - implement film lookup logic

        res.status(200).json({ 
            name: actorName, 
            films,
            actor // Include full actor details
        });
    } catch (error) {
        console.error('Error fetching actor details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
