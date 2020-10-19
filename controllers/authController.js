const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        let user = await User.findOne( { email } );

        if (!user) return res.status(400).json({ msg: "The user dosn't exist already!" });

        const passCorrecto = await bcryptjs.compare(password, user.password);

        if (!passCorrecto) return res.status(400).json({ msg: "The password is incorect" });

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, { expiresIn: 9000 }, (error, token) => { 
            if (error) throw error;

            res.json({ token: token });
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}

exports.getAuthUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');       
    }
}