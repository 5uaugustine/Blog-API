const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE POST (Protected)
router.post('/', verifyToken, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql =
    'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)';

  db.query(sql, [title, content, req.userId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Post created successfully' });
  });
});

// GET ALL POSTS (Public)
router.get('/', (req, res) => {
  const sql = `
    SELECT posts.id, posts.title, posts.content, posts.created_at,
           users.username AS author
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// UPDATE POST (Protected & Owner only)
router.put('/:id', verifyToken, (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const checkSql =
    'SELECT * FROM posts WHERE id = ? AND author_id = ?';

  db.query(checkSql, [postId, req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updateSql =
      'UPDATE posts SET title = ?, content = ? WHERE id = ?';

    db.query(updateSql, [title, content, postId], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: 'Post updated successfully' });
    });
  });
});

// DELETE POST (Protected & Owner only)
router.delete('/:id', verifyToken, (req, res) => {
  const postId = req.params.id;

  const checkSql =
    'SELECT * FROM posts WHERE id = ? AND author_id = ?';

  db.query(checkSql, [postId, req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    const deleteSql = 'DELETE FROM posts WHERE id = ?';

    db.query(deleteSql, [postId], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: 'Post deleted successfully' });
    });
  });
});

module.exports = router;
