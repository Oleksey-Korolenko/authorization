import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { IRequestWithUser } from '../auth/interface';
import UserService from '../user/user.service';
import AuthError from '../types/auth-error.type';

export class TokenService {
  private _tokenKey;

  private _userService;

  constructor() {
    this._tokenKey = process.env.TOKEN_KEY ?? '';
    this._userService = new UserService();
  }

  private checkUser = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction,
    isRefresh: boolean
  ) => {
    if (req.headers.authorization === undefined) {
      throw new AuthError(`User doesn't authorize!`);
    }
    const tokenParts = req.headers.authorization.split(' ')[1].split('.');
    const signature = crypto
      .createHmac('SHA256', this._tokenKey)
      .update(`${tokenParts[0]}.${tokenParts[1]}`)
      .digest('base64');

    if (signature === tokenParts[2]) {
      req.user = JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString('utf8')
      );
    }
    if (
      req?.user === undefined ||
      req?.user?.email === undefined ||
      (!isRefresh && req?.user?.exp === undefined)
    ) {
      throw new AuthError(`User doesn't authorize!`);
    }
    const user = await this._userService.findOne(req.user.email);
    if (user === null) {
      throw new AuthError(`User doesn't authorize!`);
    }
    if (!isRefresh) {
      const now = new Date().getTime();
      if (req.user.exp < now) {
        throw new AuthError(`User doesn't authorize!`);
      }
    }
    next();
  };

  public checkAccessToken = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    await this.checkUser(req, res, next, false);
  };

  public checkRefreshToken = async (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    await this.checkUser(req, res, next, true);
  };
}
