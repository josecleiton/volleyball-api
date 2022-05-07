import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

interface IException {
  statusCode: number;
  timestamp: string;
  path: string;
  stack?: unknown;
  message: unknown;
  name?: string;
}

interface IClassValidatorException {
  statusCode: number;
  error: string;
  message: string[];
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    exception.initMessage();
    const ex: IException = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    };
    const NODE_ENV = this.configService.get('NODE_ENV');
    if (NODE_ENV !== 'production') {
      ex.stack = exception.stack;
      ex.name = exception.name;
    }

    // Only emit to Sentry exceptions that dont have code 4xx
    if (status === 400) {
      const classValidatorEx = exception.getResponse() as IClassValidatorException;
      ex.message = classValidatorEx.message;
      ex.name = classValidatorEx.error;
    }

    response.status(status).send(ex);
  }
}

