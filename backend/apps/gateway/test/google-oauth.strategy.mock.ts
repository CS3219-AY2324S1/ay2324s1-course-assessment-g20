import { GoogleOauthStrategy } from '../src/oauthProviders/google/google-oauth.strategy';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { MOCK_GOOGLE_USER } from './mocks/google-user.mock';

export class MockGoogleOAuthStrategy extends GoogleOauthStrategy {
  authenticate(req: Request<ParamsDictionary>, options?: any) {
    req.user = MOCK_GOOGLE_USER;
    return super.authenticate(req, options);
  }
}
