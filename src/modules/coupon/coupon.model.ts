import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../../config/database';

export enum CouponStatusEnum {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  USED = 'used',
}

export class Coupon extends Model<
  InferAttributes<Coupon>,
  InferCreationAttributes<Coupon>
> {
  declare id: CreationOptional<number>;
  declare pin: string;
  declare couponMetadataId: number;
  declare status: CouponStatusEnum;
  declare orderId: number;
  declare usedAt: Date | null;
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    //TODO 지금은 uniqe하지 않음
    pin: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // unique: true
    },
    couponMetadataId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(CouponStatusEnum)),
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'coupon',
    timestamps: false,
    underscored: true,
  }
);
