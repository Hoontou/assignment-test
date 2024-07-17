# 더블엔씨 코딩 테스트 repo

백엔드 신입 권도훈

## HOW TO START

node v20.15.1

### 1. docker-compose로 mysql up

mysql connect 설정은 .env 에 있음.

```
docker-compose up
```

### 2. 패키지 설치

```
yarn install
```

### 3. 서버 start

```
yarn dev
```

이후 아래 로그 세줄 확인되면 서버 정상 start 완료.

```
server up 3000
Connection has been established successfully.
All models were synchronized successfully.
```

## API 상세

### 1. 주문 조회 API

#### GET localhost:3000/orders/1

#### (localhost:3000/orders/:orderId)

주문 getOneById(1)

### 2. 주문 전체 조회 API

#### GET localhost:3000/orders

주문 getAll()

### 3. 주문과 쿠폰을 함께 조회 API

#### GET localhost:3000/orders/1/coupons

#### (localhost:3000/orders/:orderId/coupons)

주문 getOrderByIdWithCoupons(1)

### 4. 주문 API

#### POST localhost:3000/orders

주문 create()

```typescript
body example {
    "userId": 1,
    "amount": 100000,
    "name": "비비큐 황금올리브",
    "expire": 7
}

body type {
    userId: number;
    amount: number;
    name: string;
    expire: number;
}
```

### 5. 쿠폰 개별조회 API

#### GET localhost:3000/coupons/1

#### (localhost:3000/coupons/:couponId)

쿠폰 getOne(1)

### 6. 쿠폰 개별취소 API

#### PATCH localhost:3000/coupons/1/unavailable

#### (localhost:3000/coupons/:couponId/unavailable)

markCouponAsUnavailable(1)

### 7. 쿠폰 전체취소 API

#### PATCH localhost:3000/coupons/unavailable/order/1

#### (localhost:3000/coupons/unavailable/order/:orderId)

markCouponsAsUnavailableByOrderId(1)
