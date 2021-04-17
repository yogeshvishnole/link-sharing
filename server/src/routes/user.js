import express from 'express';
import { protect, restrictTo } from '../controllers/auth';
import { getUser, updateUser } from '../controllers/user';
import { runValidation } from '../validators';
import { userUpdateValidator } from '../validators/auth';

const router = express.Router();

router.get('/', protect, restrictTo('admin', 'subscriber'), getUser);
router.patch(
  '/:id',
  userUpdateValidator,
  runValidation,
  protect,
  restrictTo('subscriber', 'admin'),
  updateUser,
);

export default router;
