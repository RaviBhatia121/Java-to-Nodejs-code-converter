// categoryRepo.js
// Mock repository for category data (MVP/demo purposes)

const mockCategories = [
  { categoryId: 1, name: "Action" },
  { categoryId: 2, name: "Comedy" },
  { categoryId: 3, name: "Drama" },
  // Add more sample categories as needed
];

/**
 * Get all categories
 * @returns {Promise<Array>}
 */
async function findAll() {
  return mockCategories;
}

/**
 * Get categories filtered by name (case-insensitive)
 * @param {string} name
 * @returns {Promise<Array>}
 */
async function findCategoriesByName(name) {
  return mockCategories.filter(
    (category) => category.name.toLowerCase() === name.toLowerCase(),
  );
}

/**
 * Get a category by its ID
 * @param {number} categoryId
 * @returns {Promise<Object|null>}
 */
async function getCategoryById(categoryId) {
  return (
    mockCategories.find((category) => category.categoryId == categoryId) || null
  );
}

module.exports = {
  findAll,
  findCategoriesByName,
  getCategoryById,
};
