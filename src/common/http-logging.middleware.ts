import { Request, Response, NextFunction } from 'express';
import { parse } from 'url';

export const httpLoggingInterceptor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, originalUrl, body } = req;
  const now = Date.now();
  const parsedUrl = parse(originalUrl, true);

  // 구분선 및 요청 로깅
  console.log(`\n--- Request Start -------------------------------------`);
  console.log(`Request received: ${method} ${parsedUrl.pathname}`);

  // 쿼리 파라미터 로깅
  if (parsedUrl.query && Object.keys(parsedUrl.query).length > 0) {
    console.log(
      `Query parameters: ${JSON.stringify(parsedUrl.query, null, 2)}`
    );
  }

  // 요청 바디 로깅
  if (Object.keys(body).length > 0) {
    console.log(`Request body: ${JSON.stringify(body, null, 2)}`);
  }

  // res.json을 감싸서 응답 데이터를 로그에 출력
  const originalJson = res.json;
  res.json = function (data) {
    console.log(`\n--- Request Processed ------------------------------`);
    console.log(
      `Response from ${method} ${parsedUrl.pathname} ${res.statusCode}: ${Date.now() - now}ms`
    );
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    console.log(`--- Request End ---------------------------------------\n`);
    return originalJson.call(this, data);
  };

  res.on('error', (err: any) => {
    const statusCode = res.statusCode ?? err.status ?? 500;
    const errorMessage = err.message;

    // 에러 발생 구분선 및 에러 로깅
    console.error(`\n--- Error Occurred ---------------------------------`);
    console.error(
      `Error from ${method} ${parsedUrl.pathname} ${statusCode}: ${Date.now() - now}ms`
    );
    console.error(`Error: ${errorMessage}`);
  });

  next();
};

// // 응답 데이터 저장
// const originalSend = res.send;
// res.send = (data, ...args) => {
//   res.locals.data = data;
//   return originalSend.apply(res, args);
// };

// res.on('finish', () => {
//   const { statusCode } = res;

//   // 요청 처리 완료 구분선 및 응답 로깅
//   console.log(`\n--- Request Processed ------------------------------`);
//   console.log(
//     `Response from ${method} ${parsedUrl.pathname} ${statusCode}: ${
//       Date.now() - now
//     }ms`
//   );
//   console.log(`Response: ${JSON.stringify(res.locals.data, null, 2)}`);
//   console.log(`--- Request End ---------------------------------------\n`);
// });
