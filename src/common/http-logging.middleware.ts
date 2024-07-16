import express, { Request, Response, NextFunction } from 'express';
import { parse } from 'url';

export const httpLoggingInterceptor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, originalUrl, headers, connection, body } = req;
  const now = Date.now();
  const parsedUrl = parse(originalUrl, true);

  // 요청 로깅
  console.log(`${method} ${parsedUrl.pathname}: Request received`);

  // 쿼리 파라미터 로깅
  if (parsedUrl.query && Object.keys(parsedUrl.query).length > 0) {
    console.debug(
      `Query parameters: ${JSON.stringify(parsedUrl.query, null, 2)}`
    );
  }

  // 요청 바디 로깅
  if (Object.keys(body).length > 0) {
    console.debug(`Request body: ${JSON.stringify(body, null, 2)}`);
  }

  res.on('finish', () => {
    const { statusCode } = res;

    // 응답 로깅
    console.log(
      `Response from ${method} ${parsedUrl.pathname} ${statusCode}: ${Date.now() - now}ms`
    );
    console.debug(`Response: ${JSON.stringify(res.locals, null, 2)}`);
  });

  res.on('error', (err: any) => {
    const statusCode = res.statusCode ?? err.status ?? 500;
    const errorMessage = err.message;

    // 에러 로깅
    console.error(
      `Error from ${method} ${parsedUrl.pathname} ${statusCode}: ${Date.now() - now}ms`
    );
    console.error(`Error: ${errorMessage}`);
  });

  next();
};
