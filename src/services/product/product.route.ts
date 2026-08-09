import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';

const router = Router();

router.post('/', auth('ADMIN'), validateRequest(ProductValidation.createProductValidation), ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.patch('/:id', auth('ADMIN'), validateRequest(ProductValidation.updateProductValidation), ProductController.updateProduct);
router.delete('/:id', auth('ADMIN'), ProductController.deleteProduct);

export const ProductRoutes = router;
