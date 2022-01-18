import express from 'express'
import { fetchMembers, refreshMembers, fetchTeams } from '../controllers/member_controller.js'
import verifyToken from '../middlewares/auth_middlewares.js';

const router = express.Router();
router.route('/').get(verifyToken, fetchMembers())
router.route('/teams').get(verifyToken, fetchTeams())
router.route('/refresh').put(verifyToken, refreshMembers())

export default router;