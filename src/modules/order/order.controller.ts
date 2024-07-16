import { Request, Response } from 'express';
import { OrderService } from './order.service';

export class OrderController {
  private static instance: OrderController;
  private orderService: OrderService;

  private constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  static getInstance(): OrderController {
    if (!OrderController.instance) {
      const orderService = OrderService.getInstance();
      OrderController.instance = new OrderController(orderService);
    }
    return OrderController.instance;
  }
}
