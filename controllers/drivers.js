const Driver = require('../models/driver');
const User = require('../models/user');

exports.getDrivers = async (req, res) => {
    try {
        const allDrivers = await Driver.find({ userId: req.params.userId });
        res.status(200).json({ drivers: allDrivers });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.postDrivers = async (req, res) => {
    const { driverId, permanentNumber, code, url, givenName, familyName, dateOfBirth, nationality } = req.body;

    try {
        const user = await User.findOne({ _id: req.params.userId });

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

        const newDriver = await driver.save();

        user.drivers.push(newDriver);
        await user.save();

        res.status(201).json({ message: 'Driver added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
