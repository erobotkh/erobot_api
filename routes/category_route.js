import verifyToken from '../middlewares/auth_middlewares.js'
import express from 'express';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category_controller.js'

const router = express.Router();

router.route('/')
  .get(verifyToken, fetchCategories())
  .post(verifyToken, createCategory())

router.route('/:category_id')
  .put(verifyToken, updateCategory())
  .delete(verifyToken, deleteCategory())

  export default router;
