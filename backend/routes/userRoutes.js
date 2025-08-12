const express = require('express');
const router = express.Router();
const multer = require('multer');
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
  resetPassword,
  registerOrLoginWithGoogle
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);
router.post('/oauth/google', registerOrLoginWithGoogle);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);
router.get('/:id', protect, getUserById);
router.get('/search', searchUsers);

module.exports = router;