import { Transaction } from 'sequelize';
import { CouponMetadata } from './coupon-metadata.model';
import { Coupon, CouponStatusEnum } from './coupon.model';
import dayjs from 'dayjs';
import { generatePin } from '../../common/generate-pin';
import { NotFoundError } from '../../common/custom-errors';
import { CustomService } from '../../common/custom-class';
import { GetOneCouponResDto } from './dto/coupon.dto';

export class CouponService extends CustomService {
  private static instance: CouponService;

  private constructor(
    private couponModel: typeof Coupon,
    private couponMetadataModel: typeof CouponMetadata
  ) {
    super();
  }

  static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService(Coupon, CouponMetadata);
    }
    return CouponService.instance;
  }

  async getOne(id: number) {
    try {
      const coupon = await this.couponModel.findByPk(id);
      if (!coupon) {
        throw new NotFoundError(`Coupon with ID ${id} not found`);
      }

      const couponMetadata = await this.couponMetadataModel.findByPk(
        coupon.couponMetadataId
      );
      if (!couponMetadata) {
        throw new NotFoundError(`Coupon with ID ${id}'s metadata not found`);
      }

      const couponDto = new GetOneCouponResDto(coupon, couponMetadata);
      console.log(`Coupon ${id}`);
      console.log(couponDto);
      return couponDto;
    } catch (error) {
      this.handleError(error, `Error fetching Coupon with ID ${id}`);
    }
  }

  async createCoupons(data: {
    transaction: Transaction;
    orderId: number;
    amount: number;
    name: string;
    expire: number;
  }) {
    const { transaction, orderId, amount, name, expire } = data;

    const couponMetadata = await this.couponMetadataModel.create(
      {
        name,
        orderId,
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

    await this.couponModel.bulkCreate(newCoupons, { transaction });
    console.log(`* coupons created, amount: ${amount}`);

    return { couponMetadata };
  }
}
