import NodeCache from 'node-cache';
import path from 'path';
import fs from 'fs';
import { DriverModel } from '../models/driver.mjs';
import { checkDirname } from '../helper/check-dirname.mjs';

const myCache = new NodeCache({ stdTTL: 10 });

export async function putDriver(req, res) {
    const image = req.file;

    try {
        const updatedDriver = await DriverModel.findById(req.params.driverId);

        if (updatedDriver.imageUrl) {
            const imagePath = path.join(checkDirname(import.meta.url), '..', updatedDriver.imageUrl);
            fs.unlink(imagePath, (err) => err);
        }

        await DriverModel.updateOne({ _id: req.params.driverId }, { imageUrl: image.path });

        res.status(200).json({ message: 'Successfully updated driver!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function deleteDriver(req, res) {
    try {
        const deletedDriver = await DriverModel.findOneAndDelete({ driverId: req.params.driverId });

        if (deletedDriver.imageUrl) {
            const imagePath = path.join(checkDirname(import.meta.url), '..', deletedDriver.imageUrl);
            fs.unlink(imagePath, (err) => err);
        }

        res.status(200).json({ message: 'Successfully deleted!' });
    } catch (err) {
        res.status(500).json({ error: console.log(err) });
    }
}

export async function getSingleDriver(req, res) {
    const cachedDriver = myCache.get('driver');

    if (cachedDriver) {
        return res.status(200).json({ driver: cachedDriver });
    }

    try {
        const singleDriver = await DriverModel.findById(req.params.driverId);

        myCache.set('driver', singleDriver);

        res.status(200).json({ driver: singleDriver });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
