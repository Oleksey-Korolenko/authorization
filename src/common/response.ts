import { Response } from 'express';

export default (status: number, values: any, res: Response) => {
  res.status(status);
  return res.send({
    status,
    ...values,
  });
};
