const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },

  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],

  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'subcategories' },
});

const order = mongoose.model('comments', commentSchema);

module.exports = order;
