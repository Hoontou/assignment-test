import express, { Application } from 'express';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import { orderRouter } from './modules/order/order.router';
import { couponRouter } from './modules/coupon/coupon.router';
import { httpLoggingInterceptor } from './common/http-logging.middleware';
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(httpLoggingInterceptor);

app.use('/coupons', couponRouter);
app.use('/orders', orderRouter);

app.listen(PORT, async () => {
  console.log(`server up ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize
      .sync()
      .then(() => {
        console.log('All models were synchronized successfully.');
      })
      .catch(() => {
        console.log('err while sequelize.sync()');
      });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
