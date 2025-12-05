import { Router } from 'express';
import { asyncHandler } from '../../core';
import { requestValidator, roleValidator } from '../../middleware';
import { BookingController } from './bookings.controller';
import { BookingZodSchema } from './bookings.schema';
import { ROLE } from '../../config';

const router = Router();

// POST /api/v1/bookings - Create booking (Customer or Admin)
router.post(
  '/',
  roleValidator(ROLE.ADMIN, ROLE.CUSTOMER),
  requestValidator(BookingZodSchema.CreateBookingSchema),
  asyncHandler(BookingController.createBooking),
);

// GET /api/v1/bookings - Get all bookings (Role-based)
router.get(
  '/',
  roleValidator(ROLE.ADMIN, ROLE.CUSTOMER),
  asyncHandler(BookingController.getAllBookings),
);

// PUT /api/v1/bookings/:bookingId - Update booking status (Role-based)
router.put(
  '/:bookingId',
  roleValidator(ROLE.ADMIN, ROLE.CUSTOMER),
  requestValidator(BookingZodSchema.UpdateBookingSchema),
  asyncHandler(BookingController.updateBooking),
);

export { router as BookingsRoutes };
