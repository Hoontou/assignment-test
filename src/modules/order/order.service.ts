import {
  CustomError,
  InternalServerError,
  NotFoundError,
} from '../../common/custom-errors';
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

  async getAllOrders() {
    try {
      const orders = await this.orderModel.findAll();
      return orders;
    } catch (error) {
      if (error instanceof CustomError) {
        console.log(error);
        throw error;
      }

      console.log('Error fetching orders:', error);
      throw new InternalServerError('Error fetching orders');
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
      if (error instanceof CustomError) {
        console.log(error);
        throw error;
      }

      const errMsg = `Error fetching order with ID ${id}:`;
      console.log(errMsg, error);
      throw new InternalServerError(errMsg);
    }
  }
}
