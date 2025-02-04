const { join } = require('path');
const { unlink } = require('fs');
const mongoose = require('mongoose');
const Driver = require('../models/driver');
const User = require('../models/user');

exports.getDrivers = async (req, res) => {
    try {
        const allDrivers = await Driver.find({ userId: new mongoose.Types.ObjectId(req.params.userId) });
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

exports.putDrivers = async (req, res) => {
    const image = req.file;

    try {
        await Driver.updateOne({ _id: req.params.userId }, { imageUrl: image.path });
        res.status(200).json({ message: 'Successfully updated driver!' });
    } catch (error) {
        res.status(500).json({ error: err });
    }
};

exports.deleteDrivers = async (req, res) => {
    try {
        const deletedDriver = await Driver.findOneAndDelete({ driverId: req.params.driverId });

        if (deletedDriver.imageUrl) {
            const imagePath = join(__dirname, '..', deletedDriver.imageUrl);
            unlink(imagePath, (err) => err);
        }

        res.status(200).json({ message: 'Successfully deleted!' });
    } catch (err) {
        res.status(500).json({ error: console.log(err) });
    }
};

//The same as previous but only when we delete user we need to remove everything
//Add logic to delete picture
