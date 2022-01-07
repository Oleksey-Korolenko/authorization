import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { IRequestWithUser } from '../auth/interface';
import UserService from '../user/user.service';

export class TokenService {
  private _tokenKey;

  private _userService;

  constructor() {
    this._tokenKey = process.env.TOKEN_KEY ?? '';
    this._userService = new UserService();
  }

  public checkToken = (
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    if (req.headers.authorization) {
      console.log(1);
      let tokenParts = req.headers.authorization.split(' ')[1].split('.');
      let signature = crypto
        .createHmac('SHA256', this._tokenKey)
        .update(`${tokenParts[0]}.${tokenParts[1]}`)
        .digest('base64');

      if (signature === tokenParts[2])
        req.user = JSON.parse(
          Buffer.from(tokenParts[1], 'base64').toString('utf8')
        );
    }

    next();
  };

  public checkUser = async (req: Request, res: Response) => {
    const request = req as IRequestWithUser;
    if (request.user === undefined) {
      throw new Error(`User doesn't authorize!`);
    }
    const user = await this._userService.findOne(request.user.email);
    if (user === null) {
      throw new Error(`User doesn't authorize!`);
    }
    const now = new Date().getTime();
    if (request.user.exp < now) {
      throw new Error(`User doesn't authorize!`);
    }
  };
}
