import verifyToken from '../middlewares/auth_middlewares.js'
import express from 'express';

import {
  fetchPosts,
  fetchPostDetail,
  createPost,
  updatePost,
} from '../controllers/post_controller.js'

import {
  fetchCommentsPerPost
} from '../controllers/comment_controller.js'

import {
  verifyPostOwnership,
  validateCategoryId
} from '../middlewares/post_middlewares.js';

const router = express.Router();

router.route('/')
  .get(verifyToken, fetchPosts())
  .post(verifyToken, validateCategoryId, createPost());

router.route('/:id')
  .get(verifyToken, fetchPostDetail())
  .put(verifyToken, verifyPostOwnership, validateCategoryId, updatePost())

router.route('/:id/comments').get(verifyToken, fetchCommentsPerPost())

export default router;
