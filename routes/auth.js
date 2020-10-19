// Routes
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/', 
    [
        check('email', 'You need a validated email').isEmail(),
        check('password', 'The password must be more than 6 characters').isLength( {min: 6} )
    ],
    authController.authenticateUser
);

router.get('/', auth, authController.getAuthUser);

module.exports = router;