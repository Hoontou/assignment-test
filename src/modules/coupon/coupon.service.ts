import { Transaction } from 'sequelize';
import { CouponMetadata } from './coupon-metadata.model';
import { Coupon, CouponStatusEnum } from './coupon.model';
import dayjs from 'dayjs';
import { generatePin } from '../../common/generate-pin';
import { BadRequestError, NotFoundError } from '../../common/custom-errors';
import { CustomService } from '../../common/custom-class';
import { GetOneCouponResDto } from './dto/coupon.dto';
import { sequelize } from '../../config/database';

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
      console.log(`* Coupon ${id} retrieved`);
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

  async markCouponAsUnavailable(id: number): Promise<{ couponId: number }> {
    try {
      const coupon = await this.couponModel.findByPk(id);
      if (!coupon) {
        throw new NotFoundError(`Coupon with ID ${id} not found`);
      }
      if (coupon.status !== CouponStatusEnum.AVAILABLE) {
        throw new BadRequestError(
          `Coupon ${id}'s status is not available, cannot mark as unavailable`
        );
      }
      coupon.status = CouponStatusEnum.UNAVAILABLE;
      await coupon.save();

      console.log(`* Coupon ${id} marked as unavailable`);
      return { couponId: coupon.id };
    } catch (error) {
      throw this.handleError(
        error,
        `Error while marking Coupon with ID ${id} as unavailable`
      );
    }
  }

  async markCouponsAsUnavailableByOrderId(
    orderId: number
  ): Promise<{ updatedCount: number }> {
    const transaction = await sequelize.transaction();

    try {
      //이거 단일쿼리라서 트랜잭션 필요없을텐데, 그래도 해놓는게 낫다고 알고있음.
      const [updatedCount] = await this.couponModel.update(
        { status: CouponStatusEnum.UNAVAILABLE },
        {
          where: {
            orderId,
            status: CouponStatusEnum.AVAILABLE,
          },
          transaction,
        }
      );

      if (updatedCount === 0) {
        throw new NotFoundError(
          `No available coupons found for Order ID ${orderId}`
        );
      }

      await transaction.commit();

      console.log(
        `* ${updatedCount} coupons for order ID ${orderId} marked as unavailable`
      );
      return { updatedCount };
    } catch (error) {
      await transaction.rollback();
      throw this.handleError(
        error,
        `Error while marking coupons for Order ID ${orderId} as unavailable`
      );
    }
  }

  async getCouponsByOrderId(orderId: number) {
    const coupons = await this.couponModel.findAll({
      where: { orderId },
    });

    console.log(`* Coupons for order ID ${orderId} retrieved`);
    console.log(`catched coupons length: ${coupons.length}`);
    return { coupons };
  }
}
