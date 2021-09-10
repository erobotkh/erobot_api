import express from 'express';
import {
  fetchPosts,
  fetchPostDetail,
  createPost,
} from '../controllers/post_controller.js'
import verifyToken from '../middlewares/auth_middlewares.js'

const router = express.Router();

router.route('/')
  .get(verifyToken, fetchPosts())
  .post(verifyToken, createPost());
  
router.route('/:id').get(verifyToken, fetchPostDetail())

export default router;
