import { NextFunction, Request, Response, Router } from 'express';
import { IResponse } from '../common/interface';
import { sendResponse } from '../common/response';
import AuthService from './auth.service';
import validate from './auth.validator';
import { IAuthRquestBody, IAuthTokens } from './interface';

export default (router: typeof Router) => {
  const routes = router();

  const authService = new AuthService();

  routes.post(
    '/sign_up',
    async (
      req: Request<any, any, IAuthRquestBody, IAuthRquestBody>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const reqData = validate.authValidate.auth(req.body);

        const response = await authService.signUp(reqData);

        return sendResponse<IResponse<undefined>>(200, response, res);
      } catch (e) {
        next(e);
      }
    }
  );

  routes.post(
    '/login',
    async (
      req: Request<any, any, IAuthRquestBody, IAuthRquestBody>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const reqData = validate.authValidate.auth(req.query);

        const response = await authService.logIn(reqData);

        return sendResponse<IResponse<IAuthTokens>>(200, response, res);
      } catch (e) {
        next(e);
      }
    }
  );

  routes.post(
    '/refresh',
    (
      req: Request<any, any, IAuthRquestBody, IAuthRquestBody>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return sendResponse<string>(200, '', res);
      } catch (e) {
        next(e);
      }
    }
  );

  routes.get(
    '/me[0-9]',
    (
      req: Request<any, any, IAuthRquestBody, IAuthRquestBody>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return sendResponse<string>(200, '', res);
      } catch (e) {
        next(e);
      }
    }
  );

  return routes;
};
