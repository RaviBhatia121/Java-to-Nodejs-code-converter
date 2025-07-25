// mockRepo.js
// In-memory mock data for demonstration

const mockItems = [
  { id: 1, name: "Item One", description: "This is the first mock item." },
  { id: 2, name: "Item Two", description: "This is the second mock item." },
  { id: 3, name: "Item Three", description: "This is the third mock item." },
];

/**
 * Get all items
 * @returns {Promise<Array>}
 */
async function findAll() {
  // Simulate async DB access
  return mockItems;
}

/**
 * Get item by ID
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function getById(id) {
  return mockItems.find((item) => item.id === id) || null;
}

module.exports = {
  findAll,
  getById,
};
