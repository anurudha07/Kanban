const router = require('express').Router();
const userController = require('../controllers/user');
const { body } = require('express-validator');
const validation = require('../handlers/validation');
const tokenHandler = require('../handlers/tokenHandler');
const User = require('../models/user');

router.post(
  '/signup',
  // Validate username (at least 3 characters)
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),

  // Validate email format and uniqueness
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .custom(value => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('Email already in use');
        }
      });
    }),

  // Validate password
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  // Run validation
  validation.validate,
  userController.register
);

router.post(
  '/login',
  // Validate username (at least 3 characters)
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validation.validate,
  userController.login
);

router.post(
  '/verify-token',
  tokenHandler.verifyToken,
  (req, res) => {
    res.status(200).json({ user: req.user });
  }
);

module.exports = router;