import { Schema, model } from 'mongoose';

const postSchema = new Schema(
    {
        title: String,
        content: String,
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const PostModel = model('Post', postSchema);

export { PostModel };
