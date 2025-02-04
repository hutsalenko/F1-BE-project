const { join } = require('path');
const { unlink } = require('fs');
const Driver = require('../models/driver');

exports.putDriver = async (req, res) => {
    const image = req.file;

    try {
        const updatedDriver = await Driver.findById({ _id: req.params.driverId });

        if (updatedDriver.imageUrl) {
            const imagePath = join(__dirname, '..', updatedDriver.imageUrl);
            unlink(imagePath, (err) => err);
        }

        await Driver.updateOne({ _id: req.params.driverId }, { imageUrl: image.path });
        res.status(200).json({ message: 'Successfully updated driver!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.deleteDriver = async (req, res) => {
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

exports.getSingleDriver = async (req, res) => {
    try {
        const singleDriver = await Driver.findOne({ _id: req.params.driverId });
        res.status(200).json({ driver: singleDriver });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

//The same as previous but only when we delete user we need to remove everything
//Add logic to delete picture
