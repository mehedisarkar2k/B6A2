import type { Request, Response } from 'express';
import { BookingService } from './bookings.service';
import { Logger, SendResponse } from '../../core';
import { ENV } from '../../config';

/**
 * Cron handler for auto-returning expired bookings
 * This endpoint is called by Vercel Cron Jobs daily
 */
export const autoReturnCronHandler = async (req: Request, res: Response) => {
  // Verify the request is from Vercel Cron (security check)
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${ENV.CRON_SECRET}`) {
    return SendResponse.unauthorized({
      res,
      message: 'Unauthorized cron request',
    });
  }

  try {
    const result = await BookingService.autoReturnExpiredBookings();

    Logger.info(
      `Auto-return cron completed: ${result.updated} bookings marked as returned`,
    );

    return SendResponse.success({
      res,
      message: `Auto-return completed successfully`,
      data: {
        updatedCount: result.updated,
        bookingIds: result.bookingIds,
      },
    });
  } catch (error) {
    Logger.error('Auto-return cron failed:', error);
    return SendResponse.internalServerError({
      res,
      message: 'Auto-return cron failed',
    });
  }
};
