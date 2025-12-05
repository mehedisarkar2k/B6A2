import { Router } from 'express';
import { autoReturnCronHandler } from '../modules/bookings/bookings.cron';

const router = Router();

// Cron endpoint for auto-returning expired bookings
// Called daily by Vercel Cron Jobs
router.get('/auto-return', autoReturnCronHandler);

export { router as cronRoutes };
