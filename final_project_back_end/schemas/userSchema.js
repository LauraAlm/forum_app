const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imgURL: {
    type: String,
    required: false,
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  },

  role: {
    type: String,
    required: true,
  },

  emailActivation: {
    type: String,
    required: false,
    default: '',
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const order = mongoose.model('Users', userSchema);
module.exports = order;
