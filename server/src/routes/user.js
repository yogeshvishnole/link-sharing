import express from 'express';
import { protect, restrictTo } from '../controllers/auth';
import { getUser } from '../controllers/user';

const router = express.Router();

router.get('/', protect, restrictTo('admin', 'subscriber'), getUser);

export default router;
