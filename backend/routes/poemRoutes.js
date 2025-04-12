const express = require('express');
const router = express.Router();
const { createPoem, getAllPoems, likePoem, commentPoem, deleteComment, updatePoem, deletePoem } = require('../controllers/poemController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPoem); // Protect this route
router.get('/', getAllPoems);
router.post('/:id/like', protect, likePoem); // Protect this route
router.post('/:id/comment', protect, commentPoem); // Protect this route
router.delete('/:poemId/comments/:commentId', protect, deleteComment); // Protect this route
router.put('/:id', protect, updatePoem);
router.delete('/:id', protect, deletePoem);

module.exports = router;