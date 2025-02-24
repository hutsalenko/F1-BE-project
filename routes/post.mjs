import { Router } from 'express';
import { getPosts, createPost, updatePost, deletePost } from '../controllers/post.mjs';
import isAuth from '../middleware/is-auth.mjs';

const router = Router();

router.get('/posts', isAuth, getPosts);
router.post('/post', isAuth, createPost);
router.put('/post/:postId', isAuth, updatePost);
router.delete('/post/:postId', isAuth, deletePost);

export { router as postRoutes };
