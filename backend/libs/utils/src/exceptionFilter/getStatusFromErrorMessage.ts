import { HttpStatus } from '@nestjs/common';
import { PEERPREP_EXCEPTION_TYPES } from '@app/types/exceptions';

export const getStatusFromErrorMessage = (message: string): number => {
  if (message.includes(PEERPREP_EXCEPTION_TYPES.BAD_REQUEST)) {
    return HttpStatus.BAD_REQUEST;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.UNAUTHORIZED)) {
    return HttpStatus.UNAUTHORIZED;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.FORBIDDEN)) {
    return HttpStatus.FORBIDDEN;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.NOT_FOUND)) {
    return HttpStatus.NOT_FOUND;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.METHOD_NOT_ALLOWED)) {
    return HttpStatus.METHOD_NOT_ALLOWED;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.NOT_ACCEPTABLE)) {
    return HttpStatus.NOT_ACCEPTABLE;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.REQUEST_TIMEOUT)) {
    return HttpStatus.REQUEST_TIMEOUT;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.CONFLICT)) {
    return HttpStatus.CONFLICT;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.GONE)) {
    return HttpStatus.GONE;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.PAYLOAD_TOO_LARGE)) {
    return HttpStatus.PAYLOAD_TOO_LARGE;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.UNSUPPORTED_MEDIA_TYPE)) {
    return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.I_AM_A_TEAPOT)) {
    return HttpStatus.I_AM_A_TEAPOT;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.MISDIRECTED)) {
    return HttpStatus.MISDIRECTED;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.UNPROCESSABLE_ENTITY)) {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.FAILED_DEPENDENCY)) {
    return HttpStatus.FAILED_DEPENDENCY;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.PRECONDITION_REQUIRED)) {
    return HttpStatus.PRECONDITION_REQUIRED;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.TOO_MANY_REQUESTS)) {
    return HttpStatus.TOO_MANY_REQUESTS;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.INTERNAL_SERVER_ERROR)) {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.NOT_IMPLEMENTED)) {
    return HttpStatus.NOT_IMPLEMENTED;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.BAD_GATEWAY)) {
    return HttpStatus.BAD_GATEWAY;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.SERVICE_UNAVAILABLE)) {
    return HttpStatus.SERVICE_UNAVAILABLE;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.GATEWAY_TIMEOUT)) {
    return HttpStatus.GATEWAY_TIMEOUT;
  }
  if (message.includes(PEERPREP_EXCEPTION_TYPES.HTTP_VERSION_NOT_SUPPORTED)) {
    return HttpStatus.HTTP_VERSION_NOT_SUPPORTED;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
};
