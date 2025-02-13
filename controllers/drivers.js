const Driver = require('../models/driver');
const User = require('../models/user');

exports.getDrivers = async (req, res) => {
    const currentPage = +req.query.page || 1;
    const limitPerPage = +req.query.limit || 10;

    try {
        const total = await Driver.find({ userId: req.userId }).countDocuments();
        const allDrivers = await Driver.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * limitPerPage)
            .limit(limitPerPage);

        res.status(200).json({ drivers: allDrivers, totalItems: total });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.postDrivers = async (req, res) => {
    const { driverId, permanentNumber, code, url, givenName, familyName, dateOfBirth, nationality } = req.body;

    try {
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newDriver = await Driver.create({
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
};

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
