import { Router } from 'express';
import { AuthRoutes } from '../services/auth/auth.route';
import { UserRoutes } from '../services/user/user.route';
import { CategoryRoutes } from '../services/category/category.route';
import { ProductRoutes } from '../services/product/product.route';
import { ReviewRoutes } from '../services/review/review.route';
import { OrderRoutes } from '../services/order/order.route';
import { WishlistRoutes } from '../services/wishlist/wishlist.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/categories', route: CategoryRoutes },
  { path: '/products', route: ProductRoutes },
  { path: '/reviews', route: ReviewRoutes },
  { path: '/orders', route: OrderRoutes },
  { path: '/wishlist', route: WishlistRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
