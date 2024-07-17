import { Router, Request, Response, NextFunction } from 'express';
import { OrderController } from './order.controller';
import { body, validationResult } from 'express-validator';

const router: Router = Router();
const orderController = OrderController.getInstance();

const validateCreateOrder = [
  body('userId')
    .isInt()
    .notEmpty()
    .withMessage('User ID must be an integer and not empty'),
  body('amount')
    .isInt({ min: 1 })
    .notEmpty()
    .withMessage('Amount must be at least 1 and not empty'),
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name must be a string and not empty'),
  body('expire')
    .isInt({ min: 1 })
    .notEmpty()
    .withMessage('Expire must be at least 1 and not empty'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

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
