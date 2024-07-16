import { NextFunction, Request, Response } from 'express';
import { OrderService } from './order.service';
import { CustomController } from '../../common/custom-class';

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
      const orders = await this.orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.orderService.getOne(Number(req.params.id));
      res.status(200).json(order);
    } catch (error) {
      this.handleResponseError(res, error);
    }
  }
}
