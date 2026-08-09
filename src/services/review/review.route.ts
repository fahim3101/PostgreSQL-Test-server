import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

const router = Router();

router.post('/', auth('ADMIN', 'USER'), validateRequest(ReviewValidation.createReviewValidation), ReviewController.createReview);
router.get('/', ReviewController.getAllReviews);
router.get('/:id', ReviewController.getReviewById);
router.patch('/:id', auth('ADMIN', 'USER'), validateRequest(ReviewValidation.updateReviewValidation), ReviewController.updateReview);
router.delete('/:id', auth('ADMIN', 'USER'), ReviewController.deleteReview);

export const ReviewRoutes = router;
