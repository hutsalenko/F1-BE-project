const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    try {
        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(500).json({ error: 'User already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Successfully created user' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existedUser = await User.findOne({ email });

        if (!existedUser) {
            return res.status(500).json({ error: 'A user with this email could not be found.' });
        }

        const isCorrectPassword = await bcrypt.compare(password, existedUser.password);

        if (!isCorrectPassword) {
            return res.status(500).json({ error: 'Wrong password!' });
        }

        const token = jwt.sign(
            {
                email: existedUser.email,
                userId: existedUser._id.toString(),
            },
            process.env.SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN }
        );

        res.status(200).json({
            token: token,
            userId: existedUser._id.toString(),
            message: 'Successfully created user',
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
