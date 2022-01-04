import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../common/response';

const catchError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorResponse(err, res);
};

export default catchError;
