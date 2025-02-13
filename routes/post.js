const express = require('express');

const postController = require('../controllers/post');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, postController.getPosts);

router.post('/post', isAuth, postController.createPost);

router.put('/post/:postId', isAuth, postController.updatePost);

router.delete('/post/:postId', isAuth, postController.deletePost);

module.exports = router;
