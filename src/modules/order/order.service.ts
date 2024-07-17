import { CustomService } from '../../common/custom-class';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../common/custom-errors';
import { sequelize } from '../../config/database';
import { Order, OrderStatusEnum } from './order.model';
import { CouponService } from '../coupon/coupon.service';
import { GetOneOrderResDto, GetOrderWithCouponsRes } from './dto/order.dto';
import { CouponMetadata } from '../coupon/model/coupon-metadata.model';

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

  async getAllOrders(): Promise<Order[]> {
    try {
      const orders = await this.orderModel.findAll();
      return orders;
    } catch (error) {
      throw this.handleError(error, 'Error fetching orders');
    }
  }

  async getOne(id: number): Promise<GetOneOrderResDto> {
    try {
      const order = await this.orderModel.findByPk(id, {
        include: [
          {
            model: CouponMetadata,
            as: 'couponMetadata',
          },
        ],
      });
      if (!order) {
        throw new NotFoundError(`Order with ID ${id} not found`);
      }

      const orderDto = new GetOneOrderResDto(order);
      console.log(`* Order ${id} retrieved`);
      console.log(orderDto);
      return orderDto;
    } catch (error) {
      throw this.handleError(error, `Error fetching order with ID ${id}`);
    }
  }

  async getOrderWithCoupons(orderId: number): Promise<GetOrderWithCouponsRes> {
    try {
      const order = await this.orderModel.findByPk(orderId, {
        include: [
          {
            model: CouponMetadata,
            as: 'couponMetadata',
          },
        ],
      });

      if (!order) {
        throw new NotFoundError(`Order with ID ${orderId} not found`);
      }

      const orderDto = new GetOneOrderResDto(order);
      console.log(`* Order ${orderId} retrieved`);
      console.log(orderDto);

      if (order.status !== OrderStatusEnum.SUCCEED) {
        throw new BadRequestError(
          `Order ${orderId}'s status is ${order.status}, cannot get coupons.`
        );
      }

      const coupons = await this.couponService.getCouponsByOrderId(orderId);
      return { order: orderDto, coupons };
    } catch (error) {
      throw this.handleError(
        error,
        `Error fetching order with coupons for order ID ${orderId}`
      );
    }
  }

  async createOrder(data: {
    userId: number;
    amount: number;
    name: string;
    expire: number;
  }): Promise<{ newOrderId: number }> {
    const { userId, amount } = data;

    const newOrder = await this.orderModel
      .create({
        userId,
        amount,
        status: OrderStatusEnum.PENDING,
      })
      .then((res) => {
        console.log(`* order created, id: ${res.id}`);
        return res;
      })
      .catch((error) => {
        console.log(error);
        throw new InternalServerError(`Error while create new order`);
      });
    const transaction = await sequelize.transaction();

    try {
      await this.couponService.createCoupons({
        transaction,
        orderId: newOrder.id,
        ...data,
      });

      //TODO 여기둘까, 트랜잭션 커밋 밑에둘까
      await newOrder.update(
        {
          status: OrderStatusEnum.SUCCEED,
        },
        { transaction }
      );

      await transaction.commit();
      console.log('* order creation succeed');
    } catch (error) {
      await transaction.rollback();
      await newOrder.update({ status: OrderStatusEnum.FAILED });

      console.log(`Error while create new coupons, order id: ${newOrder.id}`);
      console.log(error);
    } finally {
      console.log('* newOrder');
      console.log(newOrder.dataValues);
      return { newOrderId: newOrder.id };
    }
  }
}
