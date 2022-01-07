import { Request, Response, Router } from 'express';
import { IResponse } from '../common/interface';
import { sendResponse } from '../common/response';
import { asyncHandler, TokenService } from '../middlewares';
import AuthService from './auth.service';
import validate from './auth.validator';
import { IAuthRquestBody, IAuthTokens } from './interface';

export default (router: typeof Router) => {
  const routes = router();

  const authService = new AuthService();

  const tokenService = new TokenService();

  routes.post(
    '/sign_up',
    asyncHandler(async (req: Request, res: Response) => {
      const reqData = validate.authValidate.auth(req.body as IAuthRquestBody);

      const response = await authService.signUp(reqData);

      return sendResponse<IResponse<undefined>>(200, response, res);
    })
  );

  routes.post(
    '/login',
    asyncHandler(async (req: Request, res: Response) => {
      const reqData = validate.authValidate.auth(
        req.query as unknown as IAuthRquestBody
      );

      const response = await authService.logIn(reqData);

      return sendResponse<IResponse<IAuthTokens>>(200, response, res);
    })
  );

  routes.post(
    '/refresh',
    asyncHandler((req: Request, res: Response) => {
      return sendResponse<string>(200, '', res);
    })
  );

  routes.get(
    '/me[0-9]',
    asyncHandler(tokenService.checkUser),
    asyncHandler(async (req: Request, res: Response) => {
      console.log(33);
      return sendResponse<string>(200, '', res);
    })
  );

  return routes;
};
