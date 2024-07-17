import { NextFunction, Request, Response } from 'express';
import { CouponService } from './coupon.service';
import { CustomController } from '../../common/custom-class';
import { GetOneCouponResDto } from './dto/coupon.dto';

export class CouponController extends CustomController {
  private static instance: CouponController;
  private couponService: CouponService;

  private constructor(couponService: CouponService) {
    super();
    this.couponService = couponService;
  }

  static getInstance(): CouponController {
    if (!CouponController.instance) {
      const couponService = CouponService.getInstance();
      CouponController.instance = new CouponController(couponService);
    }
    return CouponController.instance;
  }

  async getCouponById(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon: GetOneCouponResDto = await this.couponService.getOne(
        Number(req.params.id)
      );
      res.status(200).json(coupon);
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }

  async markCouponAsUnavailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { couponId } = await this.couponService.markCouponAsUnavailable(
        Number(req.params.id)
      );
      res.status(200).json({ couponId });
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }

  async markCouponsAsUnavailableByOrderId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result: {
        updatedCount: number;
        orderId: number;
      } = await this.couponService.markCouponsAsUnavailableByOrderId(
        Number(req.params.id)
      );
      res.status(200).json(result);
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }
}
