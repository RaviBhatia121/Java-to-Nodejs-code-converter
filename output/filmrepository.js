// filmRepo.js
// Mock repository for film data (MVP/demo purposes)

const mockFilms = [
  {
    filmId: 1,
    title: "Inception",
    category: "Sci-Fi",
    description: "A mind-bending thriller.",
  },
  {
    filmId: 2,
    title: "The Matrix",
    category: "Action",
    description: "Reality is an illusion.",
  },
  {
    filmId: 3,
    title: "The Godfather",
    category: "Crime",
    description: "Crime family saga.",
  },
  // Add more sample films as needed
];

/**
 * Get all films
 * @returns {Promise<Array>}
 */
async function findAll() {
  return mockFilms;
}

/**
 * Get films filtered by title (case-insensitive)
 * @param {string} title
 * @returns {Promise<Array>}
 */
async function findByTitle(title) {
  return mockFilms.filter(
    (film) => film.title.toLowerCase() === title.toLowerCase(),
  );
}

/**
 * Get films filtered by category (case-insensitive)
 * @param {string} category
 * @returns {Promise<Array>}
 */
async function findByCategory(category) {
  return mockFilms.filter(
    (film) => film.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Get films filtered by title and category (case-insensitive)
 * @param {string} title
 * @param {string} category
 * @returns {Promise<Array>}
 */
async function findByTitleAndCategory(title, category) {
  return mockFilms.filter(
    (film) =>
      film.title.toLowerCase() === title.toLowerCase() &&
      film.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Get a film by its ID
 * @param {number} filmId
 * @returns {Promise<Object|null>}
 */
async function getFilmById(filmId) {
  return mockFilms.find((film) => film.filmId == filmId) || null;
}

module.exports = {
  findAll,
  findByTitle,
  findByCategory,
  findByTitleAndCategory,
  getFilmById,
};
