import { CouponMetadata, ICouponMetadataDto } from '../coupon-metadata.model';
import { Coupon, CouponStatusEnum } from '../coupon.model';

export class CouponMetadataDto implements ICouponMetadataDto {
  declare id: number;
  declare orderId: number;
  declare name: string;
  declare expiresAt: string;
  declare createdAt: string;

  constructor(couponMetadata: CouponMetadata) {
    this.id = couponMetadata.id;
    this.orderId = couponMetadata.orderId;
    this.name = couponMetadata.name;
    this.expiresAt = couponMetadata.getFormattedExpirationDate();
    this.createdAt = couponMetadata.getFormattedCreationDate();
  }
}

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
    this.couponMetadata = new CouponMetadataDto(couponMetadata);
  }
}
