import express from 'express';
import {
  fetchPosts,
  fetchPostDetail,
} from '../controllers/post_controller.js'

const router = express.Router();

router.route('/').get(fetchPosts())
router.route('/:id').get(fetchPostDetail)

export default router;
