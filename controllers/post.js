const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('creator').sort({ createdAt: -1 });

        res.status(200).json({ message: 'Fetched posts successfully.', posts: posts });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.createPost = async (req, res) => {
    console.log(req.body);

    try {
        const post = await Post.create({
            content: req.body.content,
            creator: req.userId,
        });

        const user = await User.findById(req.userId);

        user.posts.push(post);
        await user.save();
        io.getIO().emit('posts', {
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
};

exports.updatePost = async (req, res) => {
    const postId = req.params.postId;
    const content = req.body.content;

    try {
        const post = await Post.findById(postId).populate('creator');
        if (!post) {
            return res.status(404).json({ error: 'Could not find post.' });
        }
        post.content = content;
        const result = await post.save();
        io.getIO().emit('posts', { action: 'update', post: result });
        res.status(200).json({ message: 'Post updated!', post: result });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Could not find post.' });
        }
        await Post.findByIdAndDelete(postId);

        const user = await User.findById(req.userId);
        user.posts.pull(postId);
        await user.save();
        io.getIO().emit('posts', { action: 'delete', post: postId });
        res.status(200).json({ message: 'Deleted post.' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
