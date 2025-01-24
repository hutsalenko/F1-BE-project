const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = async (req, res, next) => {
    const { email, firstName, lastName, password } = req.body;

    try {
        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(500).json({ message: 'User already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'Successfully created user' });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existedUser = await User.findOne({ email });

        if (!existedUser) {
            return res.status(500).json({ message: 'A user with this email could not be found.' });
        }

        const isCorrectPassword = await bcrypt.compare(password, existedUser.password);

        if (!isCorrectPassword) {
            return res.status(500).json({ message: 'Wrong password!' });
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};
