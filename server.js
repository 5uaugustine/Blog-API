const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/api/comments', require('./routes/comments'));
app.use('/api/comments', commentRoutes);
// Test route
app.get('/', (req, res) => {
  res.send('Blog API is running');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
