import express from 'express';
import { register } from '../controllers/auth';
import { userRegisterValidator } from '../validators/auth';
import { runValidation } from '../validators';
const router = express.Router();

router.post('/register', userRegisterValidator, runValidation, register);

export default router;
