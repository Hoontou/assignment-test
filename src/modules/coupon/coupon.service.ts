import { Transaction } from 'sequelize';
import { CouponMetadata } from './coupon-metadata.model';
import { Coupon, CouponStatusEnum } from './coupon.model';
import dayjs from 'dayjs';
import { generatePin } from '../../common/generate-pin';

export class CouponService {
  private static instance: CouponService;

  private constructor(
    private couponModel: typeof Coupon,
    private couponMetadataModel: typeof CouponMetadata
  ) {}

  static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService(Coupon, CouponMetadata);
    }
    return CouponService.instance;
  }

  async createCoupons(data: {
    transaction: Transaction;
    orderId: number;
    amount: number;
    name: string;
    expire: number;
  }) {
    const { transaction, orderId, amount, name, expire } = data;

    const couponMetadata = await CouponMetadata.create(
      {
        name,
        expiresAt: dayjs().add(expire, 'days').toDate(),
      },
      { transaction }
    );

    const newCoupons = Array.from({ length: amount }, () => ({
      pin: generatePin(),
      couponMetadataId: couponMetadata.id,
      status: CouponStatusEnum.AVAILABLE,
      orderId,
    }));

    await Coupon.bulkCreate(newCoupons, { transaction });
    console.log(`* coupons created, amount: ${amount}`);

    return { couponMetadata };
  }
}
