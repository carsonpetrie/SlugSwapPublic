import {
  Body,
  Controller,
  Post,
  Res,
  TsoaResponse,
  Route,
} from 'tsoa';

import {Credentials, User, AuthCheck, SessionUser} from './types';
import {AuthService} from './service';

@Route('auth')
export class AuthController extends Controller {
  @Post('login')
  public async login(
    @Body() credentials: Credentials,
    @Res() UnauthorizedResponse: TsoaResponse<401, { reason: string }>,
  ): Promise<User> {
    return new AuthService().login(credentials)
      .then(
        (user: User) => {
          return user;
        },
        (error: Error) => {
          return UnauthorizedResponse(401, { reason: error.message });
        }
      );
  }

  @Post('check')
  public async check(
    @Body() input: AuthCheck,
    @Res() UnauthorizedResponse: TsoaResponse<401, { reason: string }>,
  ): Promise<SessionUser> {
    return new AuthService().check(input)
      .then(
        (user: SessionUser) => {
          return user;
        },
        (error: Error) => {
          return UnauthorizedResponse(401, { reason: error.message });
        }
      );
  }
}
