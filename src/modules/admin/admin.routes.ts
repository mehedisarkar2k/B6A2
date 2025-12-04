import { Router } from 'express';
import { SendResponse } from '../../core';
import { roleValidator } from '../../middleware';

const routes = Router();

routes.get('/', roleValidator(), (req, res) => {
  return SendResponse.success({
    res,
    message: 'Admin route accessed successfully.',
  });
});

export { routes as AdminRoutes };
