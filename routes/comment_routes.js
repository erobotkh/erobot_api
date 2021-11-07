import express from 'express';
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/comment_controller.js'
import verifyToken from '../middlewares/auth_middlewares.js'
import verifyCommentOwnership from '../middlewares/comment_middlewares.js'

const router = express.Router();

router.route('/')
  .get(verifyToken, fetchComments())
  .post(verifyToken, createComment())

router.route('/:comment_id')
  .put(verifyToken, verifyCommentOwnership, updateComment())
  .delete(verifyToken, verifyCommentOwnership, deleteComment())

export default router;