// Routes
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../controllers/userController');

router.post('/', 
    [
        check('name', 'The name is requierd').not().isEmpty(),
        check('email', 'You need a validated email').isEmail(),
        check('password', 'The password must be more than 6 characters').isLength( {min: 6} )
    ],
    userController.userCreate
);

module.exports = router;