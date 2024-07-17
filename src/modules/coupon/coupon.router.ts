import { Router } from 'express';
import { CouponController } from './coupon.controller';
import { validateGetOrderById } from '../order/dto/order.validation';

const router: Router = Router();
const couponController = CouponController.getInstance();

/**getOne */
router.get('/:id', validateGetOrderById, (req, res, next) =>
  couponController.getCouponById(req, res, next)
);

/** Mark coupon as unavailable */
router.patch('/:id/unavailable', validateGetOrderById, (req, res, next) =>
  couponController.markCouponAsUnavailable(req, res, next)
);

/** Mark coupon as unavailable By Order id */
router.patch('/unavailable/order/:id', validateGetOrderById, (req, res, next) =>
  couponController.markCouponsAsUnavailableByOrderId(req, res, next)
);

export const couponRouter: Router = router;
