const User = require('../models/user');

exports.postUser = async (req, res, next) => {
    const { email, firstName, lastName } = req.body;

    const user = new User({
        email,
        firstName,
        lastName,
    });

    try {
        await user.save();
        res.status(201).json({ message: 'Successfully created user!' });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({ users: allUsers });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};
