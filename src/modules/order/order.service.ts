import { CustomService } from '../../common/custom-class';
import {
  CustomError,
  InternalServerError,
  NotFoundError,
} from '../../common/custom-errors';
import { CouponMetadata } from '../coupon/coupon-metadata.model';
import { Coupon } from '../coupon/coupon.model';
import { Order } from './order.model';

export class OrderService extends CustomService {
  private static instance: OrderService;

  private constructor(
    private orderModel: typeof Order,
    private couponModel: typeof Coupon,
    private couponMetadataModel: typeof CouponMetadata
  ) {
    super();
  }

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService(Order, Coupon, CouponMetadata);
    }
    return OrderService.instance;
  }

  async getAllOrders() {
    try {
      const orders = await this.orderModel.findAll();
      return orders;
    } catch (error) {
      this.handleError(error, 'Error fetching orders');
    }
  }

  async getOne(id: number) {
    try {
      const order = await this.orderModel.findByPk(id);
      if (!order) {
        throw new NotFoundError(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      this.handleError(error, `Error fetching order with ID ${id}`);
    }
  }
}
