import { RpcException } from '@nestjs/microservices';
import { PEERPREP_EXCEPTION_TYPES } from '@app/types/exceptions';

export class PeerprepException extends RpcException {
  constructor(message: string, exception: `${PEERPREP_EXCEPTION_TYPES}`) {
    super({ message: `${exception}:${message}` });
  }
}
