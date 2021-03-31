import express from 'express';
import { runValidation } from '../validators/';
import { protect, restrictTo } from '../controllers/auth';
import {
  categoryCreateValidator,
  categoryUpdateValidator,
} from '../validators/category';
import { create, list, read, update, remove } from '../controllers/category';

const router = express.Router();

router
  .route('/')
  .post(
    // categoryCreateValidator,
    // runValidation,
    protect,
    restrictTo('admin'),
    create,
  )
  .get(list);

router
  .route('/:slug')
  .patch(
    categoryUpdateValidator,
    runValidation,
    protect,
    restrictTo('admin'),
    update,
  )
  .get(read)
  .delete(protect, restrictTo('admin'), remove);

export default router;
