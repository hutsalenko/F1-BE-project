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
    // id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Driver', driverSchema);
