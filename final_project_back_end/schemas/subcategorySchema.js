const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },

  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
});

const order = mongoose.model('subcategories', subcategorySchema);

module.exports = order;
