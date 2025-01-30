const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    driverId: String,
    permanentNumber: Number,
    code: String,
    url: String,
    givenName: String,
    familyName: String,
    dateOfBirth: Date,
    nationality: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: String,
});

module.exports = mongoose.model('Driver', driverSchema);
