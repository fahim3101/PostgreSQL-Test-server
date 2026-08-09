import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';

const router = Router();

router.get('/me', auth('ADMIN', 'USER'), UserController.getMe);
router.get('/', auth('ADMIN'), UserController.getAllUsers);
router.get('/:id', auth('ADMIN', 'USER'), UserController.getUserById);
router.patch('/:id', auth('ADMIN', 'USER'), validateRequest(UserValidation.updateUserValidation), UserController.updateUser);
router.patch('/:id/role', auth('ADMIN'), validateRequest(UserValidation.changeRoleValidation), UserController.changeUserRole);
router.delete('/:id', auth('ADMIN'), UserController.deleteUser);

export const UserRoutes = router;
