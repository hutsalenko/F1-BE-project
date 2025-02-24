import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        email: String,
        firstName: String,
        lastName: String,
        password: String,
        drivers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Driver',
            },
        ],
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    { timestamps: true }
);

const UserModel = model('User', userSchema);

export { UserModel };
