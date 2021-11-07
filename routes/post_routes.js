import verifyToken from '../middlewares/auth_middlewares.js'
import express from 'express';
import {
  fetchPosts,
  fetchPostDetail,
  createPost,
} from '../controllers/post_controller.js'
import {
  fetchCommentsPerPost
} from '../controllers/comment_controller.js'

const router = express.Router();

router.route('/')
  .get(verifyToken, fetchPosts())
  .post(verifyToken, createPost());

router.route('/:id').get(verifyToken, fetchPostDetail())
router.route('/:id/comments').get(verifyToken, fetchCommentsPerPost())

export default router;
