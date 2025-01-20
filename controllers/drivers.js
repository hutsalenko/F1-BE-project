const mongoose = require('mongoose');
const Driver = require('../models/driver');
const User = require('../models/user');

exports.getDrivers = async (req, res, next) => {
    try {
        const allDrivers = await Driver.find({ userId: new mongoose.Types.ObjectId(req.params.userId) });
        res.status(200).json({ drivers: allDrivers });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postDrivers = async (req, res, next) => {
    const { driverId, permanentNumber, code, url, givenName, familyName, dateOfBirth, nationality } = req.body;

    try {
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const driver = new Driver({
            driverId,
            permanentNumber,
            code,
            url,
            givenName,
            familyName,
            dateOfBirth,
            nationality,
            userId: user._id,
        });

        await driver.save();
        res.status(201).json({ message: 'Driver added successfully!' });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.deleteDrivers = async (req, res, next) => {
    try {
        await Driver.deleteOne({ driverId: req.params.driverId });
        res.status(200).json({ message: 'Successfully deleted!' });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};
