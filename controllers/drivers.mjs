import { DriverModel } from '../models/driver.mjs';
import { UserModel } from '../models/user.mjs';

export async function getDrivers(req, res) {
    const currentPage = +req.query.page || 1;
    const limitPerPage = +req.query.limit || 10;

    try {
        const total = await DriverModel.find({ userId: req.userId }).countDocuments();
        const allDrivers = await DriverModel.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * limitPerPage)
            .limit(limitPerPage);

        res.status(200).json({ drivers: allDrivers, totalItems: total });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function postDrivers(req, res) {
    const { driverId, permanentNumber, code, url, givenName, familyName, dateOfBirth, nationality } = req.body;

    try {
        const user = await UserModel.findOne({ _id: req.userId }).populate('drivers');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const ifAlreadyExist = user.drivers.some((driver) => driver.driverId === driverId);

        if (ifAlreadyExist) {
            return res.status(409).json({ error: 'Already exist!' });
        }

        const newDriver = await DriverModel.create({
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

        user.drivers.push(newDriver);
        await user.save();

        res.status(201).json({ message: 'Driver added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

//Work with create file and how to add information there
//Library 'hpp' for poluation,'helmet' for headers

// // Pagination
// const page = parseInt(req.query.page) || 1;
// const limit = parseInt(req.query.limit) || 10;

// // Filtering
// const filter = {};
// if (req.query.searchTerm) {
//     filter.$or = [
//         { name: { $regex: req.query.searchTerm, $options: 'i' } },
//         // Add other fields you want to search here
//         { category: { $regex: req.query.searchTerm, $options: 'i' } },
//         { subCategory: { $regex: req.query.searchTerm, $options: 'i' } },
//     ];
// }

// // Sorting
// const sort = {};
// if (req.query.sortBy) {
//     const [field, order] = req.query.sortBy.split(':');
//     sort[field] = order === 'desc' ? -1 : 1;
// }

// // Fetch all matching test series without pagination for global search
// const allMatchingTestSeries = await TestSeries.find(filter).sort(sort);

// // Apply pagination to the results
// const totalTestSeries = allMatchingTestSeries.length;
// const startIndex = (page - 1) * limit;
// const endIndex = startIndex + limit;
// const paginatedTestSeries = allMatchingTestSeries.slice(startIndex, endIndex);

// res.json({
//     testSeries: paginatedTestSeries,
//     totalPages: Math.ceil(totalTestSeries / limit),
//     totalItems: totalTestSeries,
// });
