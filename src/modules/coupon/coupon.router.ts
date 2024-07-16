import { Router } from 'express';
import { CouponController } from './coupon.controller';

const router: Router = Router();
const couponController = CouponController.getInstance();

export const couponRouter: Router = router;
