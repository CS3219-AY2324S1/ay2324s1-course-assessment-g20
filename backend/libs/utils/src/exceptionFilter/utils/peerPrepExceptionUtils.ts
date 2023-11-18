import {
  GRPC_UNKNOWN_ERROR,
  PEERPREP_EXCEPTION_TYPES,
} from '@app/types/exceptions';
import { HttpStatus } from '@nestjs/common';

export const getErrorTypeAndMessageFromException = (exception) => {
  const fullMessage: string = (exception as any)?.message.replace(
    GRPC_UNKNOWN_ERROR,
    '',
  );

  const splitArray = fullMessage.split(':');
  const errorType = splitArray[0];
  const errorMessage = splitArray.slice(1).join(':').trim();

  return [errorType, errorMessage];
};

export const getStatusFromErrorType = (errorType: string): number => {
  switch (errorType) {
    case PEERPREP_EXCEPTION_TYPES.BAD_REQUEST:
      return HttpStatus.BAD_REQUEST;
    case PEERPREP_EXCEPTION_TYPES.UNAUTHORIZED:
      return HttpStatus.UNAUTHORIZED;
    case PEERPREP_EXCEPTION_TYPES.FORBIDDEN:
      return HttpStatus.FORBIDDEN;
    case PEERPREP_EXCEPTION_TYPES.NOT_FOUND:
      return HttpStatus.NOT_FOUND;
    case PEERPREP_EXCEPTION_TYPES.METHOD_NOT_ALLOWED:
      return HttpStatus.METHOD_NOT_ALLOWED;
    case PEERPREP_EXCEPTION_TYPES.NOT_ACCEPTABLE:
      return HttpStatus.NOT_ACCEPTABLE;
    case PEERPREP_EXCEPTION_TYPES.REQUEST_TIMEOUT:
      return HttpStatus.REQUEST_TIMEOUT;
    case PEERPREP_EXCEPTION_TYPES.CONFLICT:
      return HttpStatus.CONFLICT;
    case PEERPREP_EXCEPTION_TYPES.GONE:
      return HttpStatus.GONE;
    case PEERPREP_EXCEPTION_TYPES.PAYLOAD_TOO_LARGE:
      return HttpStatus.PAYLOAD_TOO_LARGE;
    case PEERPREP_EXCEPTION_TYPES.UNSUPPORTED_MEDIA_TYPE:
      return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
    case PEERPREP_EXCEPTION_TYPES.I_AM_A_TEAPOT:
      return HttpStatus.I_AM_A_TEAPOT;
    case PEERPREP_EXCEPTION_TYPES.MISDIRECTED:
      return HttpStatus.MISDIRECTED;
    case PEERPREP_EXCEPTION_TYPES.UNPROCESSABLE_ENTITY:
      return HttpStatus.UNPROCESSABLE_ENTITY;
    case PEERPREP_EXCEPTION_TYPES.FAILED_DEPENDENCY:
      return HttpStatus.FAILED_DEPENDENCY;
    case PEERPREP_EXCEPTION_TYPES.PRECONDITION_REQUIRED:
      return HttpStatus.PRECONDITION_REQUIRED;
    case PEERPREP_EXCEPTION_TYPES.TOO_MANY_REQUESTS:
      return HttpStatus.TOO_MANY_REQUESTS;
    case PEERPREP_EXCEPTION_TYPES.INTERNAL_SERVER_ERROR:
      return HttpStatus.INTERNAL_SERVER_ERROR;
    case PEERPREP_EXCEPTION_TYPES.NOT_IMPLEMENTED:
      return HttpStatus.NOT_IMPLEMENTED;
    case PEERPREP_EXCEPTION_TYPES.BAD_GATEWAY:
      return HttpStatus.BAD_GATEWAY;
    case PEERPREP_EXCEPTION_TYPES.SERVICE_UNAVAILABLE:
      return HttpStatus.SERVICE_UNAVAILABLE;
    case PEERPREP_EXCEPTION_TYPES.GATEWAY_TIMEOUT:
      return HttpStatus.GATEWAY_TIMEOUT;
    case PEERPREP_EXCEPTION_TYPES.HTTP_VERSION_NOT_SUPPORTED:
      return HttpStatus.HTTP_VERSION_NOT_SUPPORTED;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
};
