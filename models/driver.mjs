import { Schema, model } from 'mongoose';

const driverSchema = new Schema(
    {
        driverId: String,
        permanentNumber: Number,
        code: String,
        url: String,
        givenName: String,
        familyName: String,
        dateOfBirth: Date,
        nationality: String,
        imageUrl: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const DriverModel = model('Driver', driverSchema);

export { DriverModel };
