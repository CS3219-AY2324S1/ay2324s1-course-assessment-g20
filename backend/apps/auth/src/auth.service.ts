import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensDaoService } from './daos/refreshTokens/refreshTokens.dao.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtTokenConfig } from './config/configuration';
import { JwtPayload } from '@app/types';

@Injectable()
export class AuthService {
  private tokenConfig: JwtTokenConfig;

  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokensDaoService: RefreshTokensDaoService,
  ) {
    this.tokenConfig = configService.get('jwtTokenConfig');
  }

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.tokenConfig.accessTokenSecret,
      expiresIn: this.tokenConfig.accessTokenExpiry,
    });
  }

  private generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.tokenConfig.refreshTokenSecret,
      expiresIn: this.tokenConfig.refreshTokenExpiry,
    });
  }

  private verifyRefreshToken(refreshToken: string): JwtPayload {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.tokenConfig.accessTokenSecret,
      });
    } catch (e) {
      throw new HttpException('Invalid refresh token', 401);
    }
  }

  /**
   * When `oldToken` is defined, modify the corresponding existing refresh token entry inplace. (i.e. during refresh token flow)
   * If undefined, create a new database entry (i.e. when signing in)
   */
  async generateJwts(user, oldToken?: string) {
    const payload: JwtPayload = { id: user.id };
    const accessToken: string = this.generateAccessToken(payload);
    const refreshToken: string = this.generateRefreshToken(payload);

    if (oldToken) {
      await this.refreshTokensDaoService.patchByRefreshToken(
        oldToken,
        refreshToken,
      );
    } else {
      await this.refreshTokensDaoService.create(user.id, refreshToken);
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateJwtsFromRefreshToken(refreshToken: string) {
    const user = this.verifyRefreshToken(refreshToken);
    const userRefreshTokens = await this.refreshTokensDaoService.findByUserId(
      user.id,
    );
    const isValidRefreshToken = userRefreshTokens.some(
      (r) => r.refreshToken === refreshToken,
    );

    if (!isValidRefreshToken) {
      throw new HttpException('Invalid refresh token', 401);
    }

    return this.generateJwts(user, refreshToken);
  }
}
