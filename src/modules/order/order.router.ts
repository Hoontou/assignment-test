import { Router } from 'express';
import { OrderController } from './order.controller';
import { validateCreateOrder } from './dto/order.validation';

const router: Router = Router();
const orderController = OrderController.getInstance();

router.get('/', (req, res, next) =>
  orderController.getAllOrders(req, res, next)
);
router.get('/:id', (req, res, next) =>
  orderController.getOrderById(req, res, next)
);
router.post('/', validateCreateOrder, (req, res, next) =>
  orderController.createOrder(req, res, next)
);

export const orderRouter: Router = router;
