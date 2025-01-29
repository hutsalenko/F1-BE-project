const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Driver = require('../models/driver');

exports.putUser = async (req, res) => {
    const { email, firstName, lastName, oldPassword, newPassword } = req.body;

    try {
        const existedUser = await User.findOne({ _id: req.params.userId });

        const isCorrectPassword = await bcrypt.compare(oldPassword, existedUser.password);

        if (!isCorrectPassword) {
            return res.status(500).json({ error: 'Wrong password!' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await User.updateOne({ _id: req.params.userId }, { email, firstName, lastName, password: hashedPassword });
        res.status(200).json({ message: 'Successfully updated user!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Getting user failed.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.userId });
        await Driver.deleteMany({ userId: req.params.userId });
        res.status(200).json({ message: 'Successfully deleted!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
