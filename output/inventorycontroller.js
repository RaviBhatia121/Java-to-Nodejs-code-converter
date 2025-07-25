// Auto-generated InventoryController stub
const express = require('express');
const router = express.Router();
const inventoryService = require('./services/inventoryService');

router.get('/inventory', async (req, res) => {
  try {
    const data = await inventoryService.getAllInventory();
    res.json(data);
  } catch (e) {
    console.error('Error fetching inventory:', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/inventory/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid inventory ID' });
    }
    const item = await inventoryService.getInventoriesById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (e) {
    console.error('Error fetching inventory by id:', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;