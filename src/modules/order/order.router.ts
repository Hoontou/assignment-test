import { Router } from 'express';
import { OrderController } from './order.controller';
import {
  validateCreateOrder,
  validateGetOrderById,
} from './dto/order.validation';

const router: Router = Router();
const orderController = OrderController.getInstance();

/**getMany */
router.get('/', (req, res, next) =>
  orderController.getAllOrders(req, res, next)
);

/**getOne */
router.get('/:id', validateGetOrderById, (req, res, next) =>
  orderController.getOrderById(req, res, next)
);

/**createOne */
router.post('/', validateCreateOrder, (req, res, next) =>
  orderController.createOrder(req, res, next)
);

export const orderRouter: Router = router;
