
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const actorRoutes = require('./output/actorcontroller');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World! Express server is running.');
});

app.use('/api/users', userRoutes);
app.use('/api', actorRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
