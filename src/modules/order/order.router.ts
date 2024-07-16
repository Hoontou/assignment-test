import { Router } from 'express';
import { OrderController } from './order.controller';

const router: Router = Router();
const orderController = OrderController.getInstance();

router.get('/', (req, res, next) =>
  orderController.getAllOrders(req, res, next)
);
router.get('/:id', (req, res, next) =>
  orderController.getOrderById(req, res, next)
);

export const orderRouter: Router = router;
