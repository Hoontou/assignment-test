import { CouponMetadataDto } from '../../coupon/dto/coupon.dto';
import {
  ICouponMetadataDto,
  CouponMetadata,
} from '../../coupon/model/coupon-metadata.model';
import { Order, OrderStatusEnum } from '../order.model';

export class GetOneOrderResDto {
  declare id: number;
  declare userId: number;
  declare orderDate: Date | string;
  declare amount: number;
  declare status: OrderStatusEnum;
  declare couponMetadata: ICouponMetadataDto | null;

  constructor(order: Order & { couponMetadata?: CouponMetadata }) {
    const { id, userId, orderDate, amount, status } = order;
    this.id = id;
    this.userId = userId;
    //굳이? 여기선 정확한 값 display가 낫지않나?
    // this.orderDate = order.getFormattedOrderDate();
    this.orderDate = orderDate;
    this.amount = amount;
    this.status = status;
    this.couponMetadata = null;

    if (order.couponMetadata) {
      this.couponMetadata = new CouponMetadataDto(order.couponMetadata);
    }
  }
}
