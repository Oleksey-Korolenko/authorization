import express from 'express';
import requireAll from 'require-all';
import dotenv from 'dotenv';
import catchError from './middlewares/catch-error.middleware';
import { connectToDatabase } from './db';

const bootstrap = async () => {
  const app = express();
  const router = express.Router;

  dotenv.config();

  await connectToDatabase();

  app.use(express.json({ limit: '3mb' }));

  try {
    const controllers = requireAll({
      dirname: __dirname,
      filter: /^.+\.(controller)\.(t|j)s$/,
      recursive: true,
    });

    for (const name in controllers) {
      app.use(
        `/api/${name}`,
        await controllers[name].controller.default(router)
      );

      console.log(`Module ${name} initialized`);
    }
  } catch (e) {
    console.error(e);
  }

  app.use(catchError);

  return app;
};

export default bootstrap;
