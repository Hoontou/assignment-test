import { Request, Response } from 'express';
import { CouponService } from './coupon.service';

export class CouponController {
  private static instance: CouponController;
  private couponService: CouponService;

  private constructor(couponService: CouponService) {
    this.couponService = couponService;
  }

  static getInstance(): CouponController {
    if (!CouponController.instance) {
      const couponService = CouponService.getInstance();
      CouponController.instance = new CouponController(couponService);
    }
    return CouponController.instance;
  }
}
