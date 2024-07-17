import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import dayjs from 'dayjs';
import { sequelize } from '../../config/database';

export enum OrderStatusEnum {
  PENDING = 'pending',
  SUCCEED = 'succeed',
  FAILED = 'failed',
}

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare orderDate: CreationOptional<Date>;
  declare amount: number;
  declare status: OrderStatusEnum;

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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatusEnum)),
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
