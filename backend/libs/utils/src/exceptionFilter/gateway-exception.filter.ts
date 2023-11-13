import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  getErrorTypeAndMessageFromException,
  getStatusFromErrorType,
} from './utils/peerPrepExceptionUtils';

@Catch()
export class GatewayExceptionFilter implements ExceptionFilter {
  private static generateErrorResponse(
    status: number,
    errorType: string,
    message: string,
    request: Request,
    response: Response,
  ): void {
    response.status(status).json({
      statusCode: status,
      error: errorType,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // handles HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      GatewayExceptionFilter.generateErrorResponse(
        status,
        exception.name,
        exception.message,
        request,
        response,
      );
      return;
    }

    // handles RpcException and other exceptions
    const [errorType, message] = getErrorTypeAndMessageFromException(exception);
    const status: number = getStatusFromErrorType(errorType);

    GatewayExceptionFilter.generateErrorResponse(
      status,
      errorType,
      message,
      request,
      response,
    );
  }
}
