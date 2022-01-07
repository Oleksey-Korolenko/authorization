import { Request, Response, Router } from 'express';
import { IResponse } from '../common/interface';
import { sendResponse } from '../common/response';
import { asyncHandler, TokenService } from '../middlewares';
import { IUserWithoutId } from '../user';
import AuthService from './auth.service';
import validate from './auth.validator';
import {
  IAccessToken,
  IAuthTokens,
  IMeResponse,
  IRequestWithUser,
} from './interface';

export default (router: typeof Router) => {
  const routes = router();

  const authService = new AuthService();

  const tokenService = new TokenService();

  routes.post(
    '/sign_up',
    asyncHandler(async (req: Request, res: Response) => {
      const reqData = validate.authValidate.auth(req.body as IUserWithoutId);

      const response = await authService.signUp(reqData);

      return sendResponse<IResponse<undefined>>(200, response, res);
    })
  );

  routes.post(
    '/login',
    asyncHandler(async (req: Request, res: Response) => {
      const reqData = validate.authValidate.auth(
        req.query as unknown as IUserWithoutId
      );

      const response = await authService.logIn(reqData);

      return sendResponse<IResponse<IAuthTokens>>(200, response, res);
    })
  );

  routes.post(
    '/refresh',
    asyncHandler(tokenService.checkRefreshToken),
    asyncHandler(async (req: IRequestWithUser, res: Response) => {
      const response = await authService.refresh(req.user.email);

      return sendResponse<IResponse<IAccessToken>>(200, response, res);
    })
  );

  routes.get(
    '/me[0-9]',
    asyncHandler(tokenService.checkAccessToken),
    asyncHandler(async (req: IRequestWithUser, res: Response) => {
      const response = await authService.me(req.user.email, req.path);

      return sendResponse<IResponse<IMeResponse>>(200, response, res);
    })
  );

  return routes;
};
