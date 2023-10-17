import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { throwError, Observable, catchError } from 'rxjs';

@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(() => exception);
  }
}

// @Catch(RpcException)
// export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
//   catch(exception: RpcException, host: ArgumentsHost) {
//     const error: any = exception.getError();
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     // console.log('error', error);

//     // response.status(error.statusCode).json(error);

//     return throwError(() => exception);
//   }
// }

// @Catch(HttpException)
// export class GrpcExceptionFilter implements ExceptionFilter<HttpException> {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const error: any = exception.getResponse();
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     console.log('error', error);

//     return response.status(error.statusCode).json(error);
//   }
// }
