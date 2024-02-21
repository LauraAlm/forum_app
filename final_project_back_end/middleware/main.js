const validator = require('email-validator');
const jwt = require('jsonwebtoken');
const resSend = require('../plugins/resSend');

require('dotenv').config();

module.exports = {
  validUsername: (req, res, next) => {
    const { username } = req.body;

    if (username.length < 4 || username.length > 20) {
      return resSend(
        res,
        false,
        null,
        'The username length is incorrect. It should be between 4 and 20 characters.'
      );
    }
    next();
  },

  validEmail: (req, res, next) => {
    const { email } = req.body;

    if (!validator.validate(email)) {
      return resSend(res, false, null, 'Email address is not valid.');
    }
    next();
  },

  validPassword: (req, res, next) => {
    const { password1, password2 } = req.body;

    if (password1.length < 4 || password1.length > 20) {
      return resSend(
        res,
        false,
        null,
        'The password length is incorrect. It should be between 4 and 20 characters.'
      );
    } else if (password1 !== password2) {
      return resSend(res, false, null, 'Passwords do not match.');
    } else if (!/[A-Z]/.test(password1)) {
      return resSend(
        res,
        false,
        null,
        'The password must contain at least one uppercase letter.'
      );
    } else if (!/[0-9]/.test(password1)) {
      return resSend(
        res,
        false,
        null,
        'The password must contain at least one digit/number.'
      );
    }

    next();
  },

  validRole: (req, res, next) => {
    const { role } = req.body;
    console.log(req.body);
    if (role !== 'User' && role !== 'Admin') {
      return resSend(
        res,
        false,
        null,
        'Please choose between two roles: User or Admin.'
      );
    }
    next();
  },

  validToken: (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) return resSend(res, false, null, 'Invalid validation token.');

      req.user = { email: decoded.email };

      next();
    });
  },

  validAdminRole: (req, res, next) => {
    const token = req.headers.authorization;
    const { role } = jwt.verify(token, process.env.JWT_SECRET);

    if (role && role === 'Admin') {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: 'Access denied. Insufficient permissions.' });
    }
  },
};
