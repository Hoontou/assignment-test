import { CouponMetadata } from './coupon-metadata.model';
import { Coupon } from './coupon.model';

export class CouponService {
  private static instance: CouponService;

  private constructor(
    private couponModel: typeof Coupon,
    private couponMetadataModel: typeof CouponMetadata
  ) {}

  static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService(Coupon, CouponMetadata);
    }
    return CouponService.instance;
  }
}
