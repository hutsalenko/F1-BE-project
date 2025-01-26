const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');
const Driver = require('../models/driver');

exports.postUser = async (req, res) => {
    const { email, firstName, lastName } = req.body;

    const user = new User({
        email,
        firstName,
        lastName,
    });

    try {
        const newUser = await user.save();
        res.status(201).json({ message: 'Successfully created user!', data: newUser });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.getUser = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({ users: allUsers });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.deleteUser = async (req, res) => {
    const selectedUser = ObjectId.createFromHexString(req.params.userId);

    try {
        await User.findOneAndDelete({ _id: selectedUser });
        await Driver.deleteMany({ userId: selectedUser });
        res.status(200).json({ message: 'Successfully deleted!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
