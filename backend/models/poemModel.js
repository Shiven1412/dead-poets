const mongoose = require('mongoose');

const poemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    user: {  // Reference to the user who posted the poem
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // 'User' is the name of the User model
    },
    likes: [{  // Array of user IDs who liked the poem
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true,
  }
);

const Poem = mongoose.model('Poem', poemSchema);

module.exports = Poem;