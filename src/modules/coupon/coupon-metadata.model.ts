import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from 'sequelize';
import dayjs from 'dayjs';
import { sequelize } from '../../config/database';
import { Order } from '../order/order.model';

export class CouponMetadata extends Model<
  InferAttributes<CouponMetadata>,
  InferCreationAttributes<CouponMetadata>
> {
  declare id: CreationOptional<number>;
  declare orderId: ForeignKey<Order['id']>;
  declare name: string;
  declare expiresAt: Date;
  declare createdAt: CreationOptional<Date>;

  getFormattedExpirationDate(): string {
    return dayjs(this.expiresAt).format('YYYY-MM-DD');
  }

  getFormattedCreationDate(): string {
    return dayjs(this.createdAt).format('YYYY-MM-DD');
  }
}

CouponMetadata.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Order,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'coupon_metadata',
    timestamps: false,
    underscored: true,
  }
);
