import { Request } from 'express';
import { IUserInfo } from '../../user';

export interface IAuthTokens extends IAccessToken, IRefreshToken {}

export interface IAccessToken {
  access_token: string;
}

export interface IRefreshToken {
  refresh_token: string;
}

export interface ITokenDate {
  email: string;
  exp: number;
}

export interface IRequestWithUser extends Request {
  user: ITokenDate;
}

export interface IMeResponse {
  request_num: number;
  data: IUserInfo;
}
