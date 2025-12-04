import type { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import { appV1Router } from './routes';
import { initDB, Logger, SendResponse } from './core';

export const startServer = (app: Express) => {
  initDB()
    .then(() => {
      Logger.info('Database connected successfully');
    })
    .catch((err) => {
      Logger.error('Database connection failed:', err);
      process.exit(1);
    });
  // middleware
  app.use(express.json());

  // routes
  app.get('/', (_, res) => {
    return SendResponse.success({ res, message: 'Welcome to the API' });
  });
  app.get('/health', (_, res) => {
    res.status(200).send('OK');
  });

  // additional route handlers can be added here
  app.use('/api/v1', appV1Router);

  // not found route handler
  app.use((req, res) => {
    const reqUrl = req.originalUrl;
    const method = req.method;
    const ip = req.ip;

    const responseMessage = `Route not found: ${method} ${reqUrl} - IP ${ip}`;
    Logger.warn(responseMessage);

    return SendResponse.notFound({ res, message: responseMessage });
  });

  // error handling middleware can be added here
  app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    Logger.error(err.stack);
    SendResponse.internalServerError({ res, message: 'Internal Server Error' });
  });
};
