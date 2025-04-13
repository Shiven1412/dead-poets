const asyncHandler = require('express-async-handler');
const Poem = require('../models/poemModel');

// @desc    Create a new poem
// @route   POST /api/poems
// @access  Private
const createPoem = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  

  const poem = await Poem.create({
    title,
    content,
    user: req.user._id,
    author: req.user._id, // Assuming you have user info in req.user from auth middleware
  });

  if (poem) {
    res.status(201).json(poem);
  } else {
    res.status(400);
    throw new Error('Invalid poem data');
  }
});

// @desc    Get all poems
// @route   GET /api/poems
// @access  Public
const getAllPoems = asyncHandler(async (req, res) => {
  const author = req.query.author;

  const query = {};
  if (author) {
    query.author = author;
  }

  const poems = await Poem.find(query)
    .populate('user', 'username email')
    .populate('author', 'username');
  res.json(poems);
});

// @desc    Like a poem
// @route   POST /api/poems/:id/like
// @access  Private
const likePoem = asyncHandler(async (req, res) => {
  const poem = await Poem.findById(req.params.id);

  if (poem) {
    const alreadyLiked = poem.likes.includes(req.user._id);

    if (alreadyLiked) {
      poem.likes = poem.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      poem.likes.push(req.user._id);
    }

    const updatedPoem = await poem.save();
    const populatedPoem = await Poem.findById(updatedPoem._id)
      .populate('user', 'username email')
      .populate('author', 'username');
    res.json(populatedPoem);
  } else {
    res.status(404);
    throw new Error('Poem not found');
  }
});

// @desc    Comment on a poem
// @route   POST /api/poems/:id/comment
// @access  Private
const commentPoem = asyncHandler(async (req, res) => {
  const poem = await Poem.findById(req.params.id);

  if (poem) {
    const comment = {
      user: req.user._id,
      text: req.body.text,
    };

    poem.comments.push(comment);
    const updatedPoem = await poem.save();
    const populatedPoem = await Poem.findById(updatedPoem._id)
      .populate('user', 'username email')
      .populate('author', 'username');
    res.status(201).json(populatedPoem);
  } else {
    res.status(404);
    throw new Error('Poem not found');
  }
});

// @desc    Delete a comment on a poem
// @route   DELETE /api/poems/:poemId/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const poem = await Poem.findById(req.params.poemId);

  if (poem) {
    const commentToDelete = poem.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );

    if (!commentToDelete) {
      res.status(404);
      throw new Error('Comment not found');
    }

    if (commentToDelete.user.toString() === req.user._id.toString() || poem.user.toString() === req.user._id.toString()) {
      poem.comments = poem.comments.filter(
        (comment) => comment._id.toString() !== req.params.commentId
      );

      const updatedPoem = await poem.save();
      const populatedPoem = await Poem.findById(updatedPoem._id)
        .populate('user', 'username email')
        .populate('author', 'username');
      res.json(populatedPoem);
    } else {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }
  } else {
    res.status(404);
    throw new Error('Poem not found');
  }
});

// @desc    Update a poem
// @route   PUT /api/poems/:id
// @access  Private
const updatePoem = asyncHandler(async (req, res) => {
  const poem = await Poem.findById(req.params.id);

  if (poem) {
    poem.title = req.body.title || poem.title;
    poem.content = req.body.content || poem.content;

    const updatedPoem = await poem.save();
    const populatedPoem = await Poem.findById(updatedPoem._id)
      .populate('user', 'username email')
      .populate('author', 'username');
    res.json(populatedPoem);
  } else {
    res.status(404);
    throw new Error('Poem not found');
  }
});

// @desc    Delete a poem
// @route   DELETE /api/poems/:id
// @access  Private
const deletePoem = asyncHandler(async (req, res) => {
  const poem = await Poem.findById(req.params.id);

  if (poem) {
    await poem.remove();
    res.json({ message: 'Poem removed' });
  } else {
    res.status(404);
    throw new Error('Poem not found');
  }
});

module.exports = { createPoem, getAllPoems, likePoem, commentPoem, deleteComment, updatePoem, deletePoem };