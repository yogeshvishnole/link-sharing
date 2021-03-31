import express from 'express';
import {
  register,
  registerActivate,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth';
import {
  userRegisterValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth';
import { runValidation } from '../validators';
const router = express.Router();

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', registerActivate);
router.post('/login', userLoginValidator, runValidation, login);
router.patch(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword,
);
router.patch(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword,
);
export default router;
