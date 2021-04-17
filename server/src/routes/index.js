import express from 'express';
import authRouter from './auth';
import userRouter from './user';
import categoryRouter from './category';
import linkRouter from './link';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/links', linkRouter);

export { router as default };
