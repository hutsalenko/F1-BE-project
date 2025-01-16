const Driver = require('../models/driver');

exports.getDrivers = async (req, res, next) => {
    try {
        const allDrivers = await Driver.find();
        res.status(200).json({ drivers: allDrivers });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postDrivers = async (req, res, next) => {
    const { driverId, permanentNumber, code, url, givenName, familyName, dateOfBirth, nationality } = req.body;

    const driver = new Driver({
        driverId,
        permanentNumber,
        code,
        url,
        givenName,
        familyName,
        dateOfBirth,
        nationality,
    });

    try {
        await driver.save();
        res.status(201).json({ message: 'Successfully added!' });
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
