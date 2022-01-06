import { Request } from 'express';

export interface IAuthRquestBody {
  email: string;
  password: string;
}

export interface IAuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface ITokenDate {
  email: string;
  exp: number;
}

export interface IRequestWithUser extends Request {
  user?: ITokenDate;
}
