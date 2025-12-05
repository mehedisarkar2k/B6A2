import { z } from 'zod';

const CreateBookingSchema = z.object({
  customer_id: z.number().int().positive(),
  vehicle_id: z.number().int().positive(),
  rent_start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  rent_end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

const UpdateBookingSchema = z.object({
  status: z.enum(['cancelled', 'returned']),
});
export type UpdateBookingInput = z.infer<typeof UpdateBookingSchema>;

const BookingIdParamSchema = z.object({
  bookingId: z.string().regex(/^\d+$/, 'Booking ID must be a number'),
});
export type BookingIdParam = z.infer<typeof BookingIdParamSchema>;

export const BookingZodSchema = {
  CreateBookingSchema,
  UpdateBookingSchema,
  BookingIdParamSchema,
};
