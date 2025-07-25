
const getUsers = (req, res) => {
  res.json({
    message: 'Users endpoint working!',
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
};

module.exports = {
  getUsers
};
