const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },

  messageRead: {
    type: Boolean,
    required: false,
    default: 'false',
  },

  time: { type: Date, default: Date.now },

  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
});

const order = mongoose.model('messages', messageSchema);

module.exports = order;
