const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

//
// CREATE COMMENT (Protected)
//
router.post('/:postId', verifyToken, (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  const sql =
    'INSERT INTO comments (post_id, content, author_id) VALUES (?, ?, ?)';

  db.query(sql, [postId, content, req.userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Comment added successfully' });
  });
});

//
// GET COMMENTS BY POST (Public)
//
router.get('/:postId', (req, res) => {
  const postId = req.params.postId;

  const sql = `
    SELECT comments.id, comments.content, comments.created_at,
           users.username AS author
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at DESC
  `;

  db.query(sql, [postId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//
// UPDATE COMMENT (Protected & Owner)
//
router.put('/:id', verifyToken, (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const checkSql =
    'SELECT * FROM comments WHERE id = ? AND author_id = ?';

  db.query(checkSql, [commentId, req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateSql =
      'UPDATE comments SET content = ? WHERE id = ?';

    db.query(updateSql, [content, commentId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Comment updated successfully' });
    });
  });
});

//
// DELETE COMMENT (Protected & Owner)
//
router.delete('/:id', verifyToken, (req, res) => {
  const commentId = req.params.id;

  const checkSql =
    'SELECT * FROM comments WHERE id = ? AND author_id = ?';

  db.query(checkSql, [commentId, req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const deleteSql =
      'DELETE FROM comments WHERE id = ?';

    db.query(deleteSql, [commentId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Comment deleted successfully' });
    });
  });
});

module.exports = router;
