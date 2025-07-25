// actorRepository.js

const { Pool } = require('pg');

/**
 * Database configuration using environment variables
 * TODO: Set these environment variables in your .env file:
 * DB_USER=sakila_user
 * DB_HOST=localhost  
 * DB_NAME=sakila
 * DB_PASSWORD=password
 * DB_PORT=5432
 */
const pool = new Pool({
    user: process.env.DB_USER || 'sakila_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sakila',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

/**
 * Find actors by first name and last name
 * @param {string} firstName
 * @param {string} lastName
 * @returns {Promise<Array>} List of actors
 */
const findActorsByFirstNameAndLastName = async (firstName, lastName) => {
  try {
    const query = {
      text: 'SELECT * FROM actors WHERE first_name = $1 AND last_name = $2',
      values: [firstName, lastName],
    };

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error finding actors by first and last name:', error);
    throw error;
  }
};

/**
 * Find actors by first name
 * @param {string} firstName
 * @returns {Promise<Array>} List of actors
 */
const findActorsByFirstName = async (firstName) => {
  try {
    const query = {
      text: 'SELECT * FROM actors WHERE first_name = $1',
      values: [firstName],
    };

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error finding actors by first name:', error);
    throw error;
  }
};

/**
 * Find actors by last name
 * @param {string} lastName
 * @returns {Promise<Array>} List of actors
 */
const findActorsByLastName = async (lastName) => {
  try {
    const query = {
      text: 'SELECT * FROM actors WHERE last_name = $1',
      values: [lastName],
    };

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error finding actors by last name:', error);
    throw error;
  }
};

/**
 * Get actor by actor ID
 * @param {number} id
 * @returns {Promise<Object>} Actor object
 */
const getActorByActorId = async (id) => {
  try {
    const query = {
      text: 'SELECT * FROM actors WHERE actor_id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  } catch (error) {
    console.error('Error getting actor by ID:', error);
    throw error;
  }
};

module.exports = {
  findActorsByFirstNameAndLastName,
  findActorsByFirstName,
  findActorsByLastName,
  getActorByActorId,
};