import verifyToken from '../middlewares/auth_middlewares.js'
import express from 'express';
import { fetchBookmarks, toggleBookmark } from '../controllers/bookmark_controller.js';

const router = express.Router();

router.route('/')
  .get(verifyToken, fetchBookmarks())
  .put(verifyToken, toggleBookmark())

export default router;
