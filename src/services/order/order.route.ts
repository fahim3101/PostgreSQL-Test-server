import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import { OrderController } from './order.controller';

const router = Router();

router.post('/', auth('ADMIN', 'USER'), validateRequest(OrderValidation.createOrderValidation), OrderController.createOrder);
router.get('/', auth('ADMIN', 'USER'), OrderController.getAllOrders);
router.get('/:id', auth('ADMIN', 'USER'), OrderController.getOrderById);
router.patch('/:id/status', auth('ADMIN'), validateRequest(OrderValidation.updateOrderStatusValidation), OrderController.updateOrderStatus);
router.delete('/:id', auth('ADMIN', 'USER'), OrderController.deleteOrder);

export const OrderRoutes = router;
