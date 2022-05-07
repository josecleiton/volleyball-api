import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ForbiddenException } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

type Callback = (err: Error|null, stat?: boolean) => void;

const isProd = process.env.NODE_ENV === 'production';

const whiteList: string[] = isProd
  ? []
  : ['http://localhost:3000', 'http://localhost:5000'];

function origin(origin: string, callback: Callback) {
  return !origin || whiteList.find(str => new RegExp(str).test(origin))
    ? callback(null, true)
    : callback(
        new ForbiddenException(
          `Origin not allowed by CORS Middleware. ${origin ?? ''}`,
        ),
      );
}

export const corsConfig = registerAs(
  'cors',
  (): CorsOptions => ({
    origin,
    optionsSuccessStatus: 200,
  }),
);

