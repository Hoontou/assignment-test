import { NextFunction, Request, Response } from 'express';
import { OrderService } from './order.service';
import { CustomController } from '../../common/custom-class';
import { Order } from './order.model';
import { GetOneOrderResDto, GetOrderWithCouponsRes } from './dto/order.dto';

export class OrderController extends CustomController {
  private static instance: OrderController;
  private orderService: OrderService;

  private constructor(orderService: OrderService) {
    super();
    this.orderService = orderService;
  }

  static getInstance(): OrderController {
    if (!OrderController.instance) {
      const orderService = OrderService.getInstance();
      OrderController.instance = new OrderController(orderService);
    }
    return OrderController.instance;
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders: Order[] = await this.orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order: GetOneOrderResDto = await this.orderService.getOne(
        Number(req.params.id)
      );
      res.status(200).json(order);
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { newOrderId } = await this.orderService.createOrder(req.body);
      res.status(201).json({ newOrderId });
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }

  async getOrderWithCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const result: GetOrderWithCouponsRes =
        await this.orderService.getOrderWithCoupons(Number(req.params.id));
      res.status(200).json(result);
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }
}
