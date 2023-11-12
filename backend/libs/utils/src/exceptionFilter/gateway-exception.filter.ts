import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import {
  getErrorTypeAndMessageFromException,
  getStatusFromErrorType,
} from './utils/peerPrepExceptionUtils';

@Catch(RpcException)
export class GatewayExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const [errorType, message] = getErrorTypeAndMessageFromException(exception);
    const status: number = getStatusFromErrorType(errorType);

    response.status(status).json({
      statusCode: status,
      error: errorType,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
