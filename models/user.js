const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    drivers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
        },
    ],
});

module.exports = mongoose.model('User', userSchema);
