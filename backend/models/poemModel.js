const mongoose = require('mongoose');

const poemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v.trim().length > 0;
        },
        message: 'Title cannot be empty or just whitespace'
      }
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          const trimmed = v.trim();
          return trimmed.length >= 5 && // At least 10 characters
                 trimmed.split('\n').filter(line => line.trim().length > 0).length >= 1; // At least 2 non-empty lines
        },
        message: 'Poem must have at least 10 characters and 2 meaningful lines'
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    likes: [{
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
        required: true,
        validate: {
          validator: function(v) {
            return v.trim().length > 0;
          },
          message: 'Comment cannot be empty or just whitespace'
        }
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true
  }
);

const Poem = mongoose.model('Poem', poemSchema);
module.exports = Poem;