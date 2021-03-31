import express from 'express';
import authRouter from './auth';
import userRouter from './user';
import categoryRouter from './category';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);

export { router as default };
