import { Router } from 'express';
import { ROUTES } from '../modules';

const appV1Router = Router();

// welcome route
appV1Router.get('/', (_, res) => {
  res.status(200).json({ success: true, message: 'Welcome to API v1' });
});

ROUTES.forEach(({ path, router }) => {
  appV1Router.use(path, router);
});

export { appV1Router };
