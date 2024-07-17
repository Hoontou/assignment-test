import dayjs from 'dayjs';
import { CustomService } from '../../common/custom-class';
import {
  CustomError,
  InternalServerError,
  NotFoundError,
} from '../../common/custom-errors';
import { sequelize } from '../../config/database';
import { CouponMetadata } from '../coupon/coupon-metadata.model';
import { Coupon } from '../coupon/coupon.model';
import { Order, OrderStatusEnum } from './order.model';
import { CouponService } from '../coupon/coupon.service';

export class OrderService extends CustomService {
  private static instance: OrderService;

  private constructor(
    private orderModel: typeof Order,
    private couponService: CouponService
  ) {
    super();
  }

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      const couponService = CouponService.getInstance();
      OrderService.instance = new OrderService(Order, couponService);
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

  async createOrder(data: {
    userId: number;
    amount: number;
    name: string;
    expire: number;
  }) {
    const { userId, amount } = data;

    const newOrder = await Order.create({
      userId,
      amount,
      status: OrderStatusEnum.PENDING,
      orderDate: new Date(),
    })
      .then((res) => {
        console.log(`order created, id: ${res.id}`);
        return res;
      })
      .catch((error) => {
        console.log(error);
        throw new InternalServerError(`Error while create new order`);
      });
    const transaction = await sequelize.transaction();

    try {
      const { couponMetadata } = await this.couponService.createCoupons({
        transaction,
        orderId: newOrder.id,
        ...data,
      });

      await newOrder.update(
        {
          couponMetadataId: couponMetadata.id,
          status: OrderStatusEnum.SUCCEED,
        },
        { transaction }
      );

      await transaction.commit();

      return { newOrder };
    } catch (error) {
      await transaction.rollback();
      await newOrder.update({ status: OrderStatusEnum.FAILED });

      console.log(`Error while create new coupons, order id: ${newOrder.id}`);
      console.log(error);
      return { newOrder };
    }
  }
}
