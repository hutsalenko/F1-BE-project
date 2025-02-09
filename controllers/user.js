const { join } = require('path');
const { unlink } = require('fs');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Driver = require('../models/driver');

exports.putUser = async (req, res) => {
    const { email, firstName, lastName, oldPassword, newPassword } = req.body;
    let hashedPassword;

    try {
        if (req.body.newPassword && req.body.oldPassword) {
            const existedUser = await User.findById(req.userId);
            const isCorrectPassword = await bcrypt.compare(oldPassword, existedUser.password);

            if (!isCorrectPassword) {
                return res.status(500).json({ error: 'Wrong password!' });
            }

            hashedPassword = await bcrypt.hash(newPassword, 12);
        }

        await User.updateOne(
            { _id: req.userId },
            {
                ...(email && { email }),
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(hashedPassword && { password: hashedPassword }),
            }
        );

        res.status(200).json({ message: 'Successfully updated user!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

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
        const deletedUser = await User.findByIdAndDelete(req.userId).populate('drivers');

        deletedUser.drivers.forEach((driver) => {
            if (driver.imageUrl) {
                const imagePath = join(__dirname, '..', driver.imageUrl);
                unlink(imagePath, (err) => err);
            }
        });

        await Driver.deleteMany({ _id: { $in: deletedUser.drivers } });
        res.status(200).json({ message: 'Successfully deleted!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
