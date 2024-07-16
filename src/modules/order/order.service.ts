import { CouponMetadata } from '../coupon/coupon-metadata.model';
import { Coupon } from '../coupon/coupon.model';
import { Order } from './order.model';

export class OrderService {
  private static instance: OrderService;

  private constructor(
    private orderModel: typeof Order,
    private couponModel: typeof Coupon,
    private couponMetadataModel: typeof CouponMetadata
  ) {}

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService(Order, Coupon, CouponMetadata);
    }
    return OrderService.instance;
  }
}
