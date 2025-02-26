import { join } from 'path';
import { unlink } from 'fs';
import { compare, hash } from 'bcryptjs';
import { UserModel } from '../models/user.mjs';
import { DriverModel } from '../models/driver.mjs';
import { checkDirname } from '../helpers/check-dirname.mjs';

export async function putUser(req, res) {
    const { email, firstName, lastName, oldPassword, newPassword } = req.body;
    let hashedPassword;

    try {
        if (req.body.newPassword && req.body.oldPassword) {
            const existedUser = await UserModel.findById(req.userId);
            const isCorrectPassword = await compare(oldPassword, existedUser.password);

            if (!isCorrectPassword) {
                return res.status(500).json({ error: 'Wrong password!' });
            }

            hashedPassword = await hash(newPassword, 12);
        }

        await UserModel.updateOne(
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
}

export async function getUser(req, res) {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Getting user failed.' });
    }
}

export async function deleteUser(req, res) {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.userId).populate('drivers');

        deletedUser.drivers.forEach((driver) => {
            if (driver.imageUrl) {
                const imagePath = join(checkDirname(import.meta.url), '..', driver.imageUrl);
                unlink(imagePath, (err) => err);
            }
        });

        await DriverModel.deleteMany({ _id: { $in: deletedUser.drivers } });
        res.status(200).json({ message: 'Successfully deleted!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
