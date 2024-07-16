import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from 'sequelize';
import dayjs from 'dayjs';
import { CouponMetadata } from '../coupon/coupon-metadata';
import { sequelize } from '../../config/database';

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare couponMetadataId: ForeignKey<CouponMetadata['id']> | null;
  declare orderDate: Date;
  declare amount: number;
  declare status: 'pending' | 'succeed' | 'failed';

  getFormattedOrderDate(): string {
    return dayjs(this.orderDate).format('YYYY-MM-DD');
  }
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    couponMetadataId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: CouponMetadata,
        key: 'id',
      },
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'succeed', 'failed'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: false,
    underscored: true,
  }
);
