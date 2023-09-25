import { IAuthContext } from './interfaces';
import { HttpRequestMethod } from './utils/constants';

export type VariableRequestBackendParams =
  | {
      method: HttpRequestMethod.POST | HttpRequestMethod.PUT | HttpRequestMethod.PATCH;
      /* eslint-disable-next-line */
      data?: any;
    }
  | {
      method: HttpRequestMethod.GET | HttpRequestMethod.DELETE;
    };

export type RequestBackendParams = {
  requireAuthentication?: boolean;
  path: string;
  authContext: IAuthContext;
} & VariableRequestBackendParams;
