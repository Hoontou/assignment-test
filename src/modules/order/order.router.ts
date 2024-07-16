import { Router } from 'express';
import { OrderController } from './order.controller';

const router: Router = Router();
const orderController = OrderController.getInstance();

export const orderRouter: Router = router;
