import express from 'express'
import { fetchProfile, updateProfile } from '../controllers/user_controller.js';
import verifyToken from '../middlewares/auth_middlewares.js';

const router = express.Router();
router.get(['/', '/:user_id'], verifyToken, fetchProfile())
router.route('/').put(verifyToken, updateProfile())

export default router;