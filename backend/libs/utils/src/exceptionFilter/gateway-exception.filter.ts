import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { getStatusFromErrorMessage } from './getStatusFromErrorMessage';
import { GRPC_UNKNOWN_ERROR } from '@app/types/exceptions';

@Catch()
export class GatewayExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message: string = (exception as any)?.message;
    const status: number = getStatusFromErrorMessage(message);

    response.status(status).json({
      statusCode: status,
      message: message.replace(GRPC_UNKNOWN_ERROR, ''),
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
