import { Request } from 'express';
import { IUserInfo } from '../../user';

export interface IAuthTokens {
  access_token: string;
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
