import { ExecutionContext } from '@nestjs/common';
import { GoogleOauthGuard } from '../src/oauthProviders/google/google-oauth.guard';
import { Observable } from 'rxjs';
import { MOCK_GOOGLE_USER } from './mocks/google-user.mock';

export class MockGoogleOauthGuard extends GoogleOauthGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    req.user = MOCK_GOOGLE_USER;
    return true;
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    console.log(user);
    return user;
  }
}
