const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  authUser, 
  getUserProfile,
  getUserById,
  updateUserProfile,
  followUser,
  unfollowUser,
  getCurrentUser,
  searchUsers,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);
router.get('/:id', protect, getUserById);
router.get('/search', searchUsers);

module.exports = router;