import { Request, Response, Router } from 'express';
import { sendResponse } from '../common/response';
import ExampleService from './auth.service';
import validate from './auth.validator';
import { IAuth } from './interface';

export default (router: typeof Router) => {
  const routes = router();

  const exampleService = new ExampleService();

  routes.post(
    '/sign_up',
    (req: Request<any, any, IAuth, IAuth>, res: Response) => {
      const reqData = validate.authValidate.auth(req.body);

      return sendResponse<string>(200, '', res);
    }
  );

  routes.post(
    '/login',
    (req: Request<any, any, IAuth, IAuth>, res: Response) => {
      const reqData = validate.authValidate.auth(req.query);

      return sendResponse<string>(200, '', res);
    }
  );

  routes.post(
    '/refresh',
    (req: Request<any, any, IAuth, IAuth>, res: Response) => {
      return sendResponse<string>(200, '', res);
    }
  );

  routes.get(
    '/me[0-9]',
    (req: Request<any, any, IAuth, IAuth>, res: Response) => {
      return sendResponse<string>(200, '', res);
    }
  );

  return routes;
};
