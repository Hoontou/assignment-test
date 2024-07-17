import { CouponMetadata, ICouponMetadataDto } from '../coupon-metadata.model';
import { Coupon, CouponStatusEnum } from '../coupon.model';

export class GetOneCouponResDto {
  declare id: number;
  declare pin: string;
  declare couponMetadata: ICouponMetadataDto;
  declare status: CouponStatusEnum;
  declare orderId: number;
  declare usedAt: Date | null;

  constructor(coupon: Coupon, couponMetadata: CouponMetadata) {
    const { id, pin, status, orderId, usedAt } = coupon;
    this.id = id;
    this.pin = pin;
    this.status = status;
    this.orderId = orderId;
    this.usedAt = usedAt;
    const couponMetadataDto: ICouponMetadataDto = {
      ...couponMetadata.dataValues,
      expiresAt: couponMetadata.getFormattedExpirationDate(),
      createdAt: couponMetadata.getFormattedCreationDate(),
    };
    this.couponMetadata = couponMetadataDto;
  }
}
