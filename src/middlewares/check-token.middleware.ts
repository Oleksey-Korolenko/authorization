import { NextFunction, Response } from 'express';
import crypto from 'crypto';
import { IRequestWithUser } from '../auth/interface';

export class Token {
  private _tokenKey;

  constructor() {
    this._tokenKey = process.env.TOKEN_KEY ?? '';
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

      console.log(req.user);

      next();
    }

    next();
  };
}
