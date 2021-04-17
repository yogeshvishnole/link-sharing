import express from 'express';
import { runValidation } from '../validators/';
import { protect, restrictTo } from '../controllers/auth';
import { linkCreateValidator, linkUpdateValidator } from '../validators/link';
import {
  create,
  list,
  read,
  update,
  remove,
  clickCount,
  loggedUserAndAdminLinkActions,
  getPopularLinks,
  getPopularLinksByCategory,
} from '../controllers/link';

const router = express.Router();

router
  .route('/')
  .post(
    linkCreateValidator,
    runValidation,
    protect,
    restrictTo('subscriber', 'admin'),
    create,
  );
router.post('/getAll', protect, restrictTo('admin'), list);
router.get('/popular', getPopularLinks);
router.get('/popular/:categoryId', getPopularLinksByCategory);

router.patch('/click-count', clickCount);

router
  .route('/:linkId')
  .patch(
    linkUpdateValidator,
    runValidation,
    protect,
    restrictTo('subscriber', 'admin'),
    loggedUserAndAdminLinkActions,
    update,
  )
  .get(read)
  .delete(
    protect,
    restrictTo('subscriber', 'admin'),
    loggedUserAndAdminLinkActions,
    remove,
  );

export default router;
