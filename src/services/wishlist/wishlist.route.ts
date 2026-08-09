import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WishlistValidation } from './wishlist.validation';
import { WishlistController } from './wishlist.controller';

const router = Router();

router.post('/', auth('ADMIN', 'USER'), validateRequest(WishlistValidation.addToWishlistValidation), WishlistController.addToWishlist);
router.get('/', auth('ADMIN', 'USER'), WishlistController.getMyWishlist);
router.delete('/:id', auth('ADMIN', 'USER'), WishlistController.removeFromWishlist);

export const WishlistRoutes = router;
