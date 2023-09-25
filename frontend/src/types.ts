import { IAuthContext } from './interfaces';
import { HttpRequestMethod } from './utils/constants';

export type RequestBackendMethodParams =
  | {
      method: HttpRequestMethod.POST | HttpRequestMethod.PUT | HttpRequestMethod.PATCH;
      /* eslint-disable-next-line */
      data?: any;
    }
  | {
      method: HttpRequestMethod.GET | HttpRequestMethod.DELETE;
    };

export type RequestBackendParams = {
  path: string;
  authContext?: IAuthContext;
} & RequestBackendMethodParams;
