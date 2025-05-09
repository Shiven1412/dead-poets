const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/userModel');
const Poem = require('../models/poemModel');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail'); // Assuming you created sendEmail.js

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('followers', 'username')
    .populate('following', 'username');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('followers', 'username')
    .populate('following', 'username');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.bio = req.body.bio || user.bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('You cannot follow yourself');
  }

  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!userToFollow) {
    res.status(404);
    throw new Error('User to follow not found');
  }

  // Check if already following
  if (currentUser.following.includes(userToFollow._id)) {
    res.status(400);
    throw new Error('You are already following this user');
  }

  // Add to current user's following list
  currentUser.following.push(userToFollow._id);
  await currentUser.save();

  // Add to target user's followers list
  userToFollow.followers.push(currentUser._id);
  await userToFollow.save();

  res.json({ 
    message: `You are now following ${userToFollow.username}`,
    following: currentUser.following,
    followers: userToFollow.followers
  });
});

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('You cannot unfollow yourself');
  }

  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!userToUnfollow) {
    res.status(404);
    throw new Error('User to unfollow not found');
  }

  // Check if not following
  if (!currentUser.following.includes(userToUnfollow._id)) {
    res.status(400);
    throw new Error('You are not following this user');
  }

  // Remove from current user's following list
  currentUser.following = currentUser.following.filter(
    id => id.toString() !== userToUnfollow._id.toString()
  );
  await currentUser.save();

  // Remove from target user's followers list
  userToUnfollow.followers = userToUnfollow.followers.filter(
    id => id.toString() !== currentUser._id.toString()
  );
  await userToUnfollow.save();

  res.json({ 
    message: `You have unfollowed ${userToUnfollow.username}`,
    following: currentUser.following,
    followers: userToUnfollow.followers
  });
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  const searchTerm = req.query.search;

  if (searchTerm) {
    try {
      const users = await User.find({
        username: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
      }).select('-password'); // Exclude password from results

      res.json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ message: 'Error searching users' });
    }
  } else {
    res.status(400).json({ message: 'Search term is required' });
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('There is no user with that email address.');
  }

  // Generate reset token
  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

  // Send email
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 1 hour)',
      message
    });

    res.status(200).json({ message: 'Token sent to email!' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('There was an error sending the email. Try again later!');
  }
});

// @desc    Reset password
// @route   PATCH /api/users/resetpassword/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  // If token not expired, and there is user, set the new password
  if (!user) {
    res.status(400);
    throw new Error('Token is invalid or has expired');
  }

  // Update password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Log the user in, send JWT
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  });
});

module.exports = { 
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
};