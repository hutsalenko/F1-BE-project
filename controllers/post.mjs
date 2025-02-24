import { getIO } from '../socket.mjs';
import { PostModel } from '../models/post.mjs';
import { UserModel } from '../models/user.mjs';

export async function getPosts(req, res) {
    try {
        const posts = await PostModel.find().populate('creator').sort({ createdAt: -1 });
        res.status(200).json({ message: 'Fetched posts successfully.', posts: posts });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function createPost(req, res) {
    try {
        const post = await PostModel.create({
            content: req.body.content,
            creator: req.userId,
        });

        const user = await UserModel.findById(req.userId);

        user.posts.push(post);
        await user.save();
        getIO().emit('posts', {
            action: 'create',
            post: { ...post._doc, creator: { _id: req.userId, firstName: user.firstName, lastName: user.lastName } },
        });
        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: { _id: user._id, name: user.name },
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function updatePost(req, res) {
    const postId = req.params.postId;
    const content = req.body.content;

    try {
        const post = await PostModel.findById(postId).populate('creator');
        if (!post) {
            return res.status(404).json({ error: 'Could not find post.' });
        }
        post.content = content;
        const result = await post.save();
        getIO().emit('posts', { action: 'update', post: result });
        res.status(200).json({ message: 'Post updated!', post: result });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function deletePost(req, res) {
    const postId = req.params.postId;

    try {
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Could not find post.' });
        }
        await PostModel.findByIdAndDelete(postId);

        const user = await UserModel.findById(req.userId);
        user.posts.pull(postId);
        await user.save();
        getIO().emit('posts', { action: 'delete', post: postId });
        res.status(200).json({ message: 'Deleted post.' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
