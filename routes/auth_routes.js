import express from 'express';
import {
  register,
  login,
  refreshToken,
} from '../controllers/auth_controller.js'

const router = express.Router();

router.route('/register').post(register())
router.route('/login').post(login())
router.route('/refresh-token').post(refreshToken())
router.route('/revoke-token').post(login())

export default router;
