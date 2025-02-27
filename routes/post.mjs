import { Router } from 'express';
import { getPosts, createPost, updatePost, deletePost } from '../controllers/post.mjs';
import { isAuth } from '../middleware/is-auth.mjs';
import { requestLimiter } from '../middleware/request-limiter.mjs';

const router = Router();

router.get('/posts', requestLimiter, isAuth, getPosts);
router.post('/post', requestLimiter, isAuth, createPost);
router.put('/post/:postId', requestLimiter, isAuth, updatePost);
router.delete('/post/:postId', requestLimiter, isAuth, deletePost);

export { router as postRoutes };
