import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../../config/database';

export class Coupon extends Model<
  InferAttributes<Coupon>,
  InferCreationAttributes<Coupon>
> {
  declare id: CreationOptional<number>;
  declare pin: string;
  declare couponMetadataId: number;
  declare status: 'available' | 'unavailable' | 'used';
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
    pin: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    couponMetadataId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'unavailable', 'used'),
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
