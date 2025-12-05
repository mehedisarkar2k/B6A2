import type { Request, Response } from 'express';
import { SendResponse } from '../../core';
import { BookingZodSchema } from './bookings.schema';
import { BookingService } from './bookings.service';

const createBooking = async (req: Request, res: Response) => {
  const payload = BookingZodSchema.CreateBookingSchema.parse(req.body);

  // Validate dates
  const startDate = new Date(payload.rent_start_date);
  const endDate = new Date(payload.rent_end_date);

  if (endDate <= startDate) {
    return SendResponse.badRequest({
      res,
      message: 'End date must be after start date',
    });
  }

  // Check if customer exists
  const customer = await BookingService.getCustomerById(payload.customer_id);
  if (!customer) {
    return SendResponse.notFound({
      res,
      message: 'Customer not found',
    });
  }

  // Check if vehicle exists
  const vehicle = await BookingService.getVehicleById(payload.vehicle_id);
  if (!vehicle) {
    return SendResponse.notFound({
      res,
      message: 'Vehicle not found',
    });
  }

  // Check if vehicle is available
  if (vehicle.availability_status !== 'available') {
    return SendResponse.badRequest({
      res,
      message: 'Vehicle is not available for booking',
    });
  }

  // Calculate total price
  const days = BookingService.calculateDaysBetween(
    payload.rent_start_date,
    payload.rent_end_date,
  );
  const totalPrice = days * Number(vehicle.daily_rent_price);

  // Create booking
  const booking = await BookingService.createBooking({
    ...payload,
    total_price: totalPrice,
  });

  if (!booking) {
    return SendResponse.internalServerError({
      res,
      message: 'Failed to create booking',
    });
  }

  // Update vehicle availability to 'booked'
  await BookingService.updateVehicleAvailability(payload.vehicle_id, 'booked');

  return SendResponse.created({
    res,
    message: 'Booking created successfully',
    data: {
      id: booking.id,
      customer_id: booking.customer_id,
      vehicle_id: booking.vehicle_id,
      rent_start_date: payload.rent_start_date,
      rent_end_date: payload.rent_end_date,
      total_price: Number(booking.total_price),
      status: booking.status,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: Number(vehicle.daily_rent_price),
      },
    },
  });
};

const getAllBookings = async (req: Request, res: Response) => {
  const currentUser = req.user!;

  if (currentUser.role === 'admin') {
    // Admin sees all bookings
    const bookings = await BookingService.getAllBookingsForAdmin();

    return SendResponse.success({
      res,
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  } else {
    // Customer sees only their own bookings
    const bookings = await BookingService.getBookingsForCustomer(
      currentUser.id,
    );

    return SendResponse.success({
      res,
      message: 'Your bookings retrieved successfully',
      data: bookings,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId } = BookingZodSchema.BookingIdParamSchema.parse(req.params);
  const { status } = BookingZodSchema.UpdateBookingSchema.parse(req.body);
  const currentUser = req.user!;
  const bookingIdNum = Number(bookingId);

  // Get existing booking
  const existingBooking = await BookingService.getBookingById(bookingIdNum);
  if (!existingBooking) {
    return SendResponse.notFound({
      res,
      message: 'Booking not found',
    });
  }

  // Check if booking is already cancelled or returned
  if (existingBooking.status !== 'active') {
    return SendResponse.badRequest({
      res,
      message: `Booking is already ${existingBooking.status}`,
    });
  }

  // Handle cancellation by customer
  if (status === 'cancelled') {
    // Customer can only cancel their own booking
    if (
      currentUser.role !== 'admin' &&
      currentUser.id !== existingBooking.customer_id
    ) {
      return SendResponse.forbidden({
        res,
        message: 'You can only cancel your own bookings',
      });
    }

    // Check if booking has started (customer can only cancel before start date)
    if (currentUser.role !== 'admin') {
      const today = new Date();
      const startDate = new Date(existingBooking.rent_start_date);
      if (today >= startDate) {
        return SendResponse.badRequest({
          res,
          message: 'Cannot cancel booking after start date',
        });
      }
    }

    // Update booking status
    const updatedBooking = await BookingService.updateBookingStatus(
      bookingIdNum,
      'cancelled',
    );

    if (!updatedBooking) {
      return SendResponse.internalServerError({
        res,
        message: 'Failed to update booking',
      });
    }

    // Update vehicle availability to 'available'
    await BookingService.updateVehicleAvailability(
      existingBooking.vehicle_id,
      'available',
    );

    return SendResponse.success({
      res,
      message: 'Booking cancelled successfully',
      data: {
        id: updatedBooking.id,
        customer_id: updatedBooking.customer_id,
        vehicle_id: updatedBooking.vehicle_id,
        rent_start_date: existingBooking.rent_start_date,
        rent_end_date: existingBooking.rent_end_date,
        total_price: Number(updatedBooking.total_price),
        status: updatedBooking.status,
      },
    });
  }

  // Handle returned by admin only
  if (status === 'returned') {
    if (currentUser.role !== 'admin') {
      return SendResponse.forbidden({
        res,
        message: 'Only admin can mark bookings as returned',
      });
    }

    // Update booking status
    const updatedBooking = await BookingService.updateBookingStatus(
      bookingIdNum,
      'returned',
    );

    if (!updatedBooking) {
      return SendResponse.internalServerError({
        res,
        message: 'Failed to update booking',
      });
    }

    // Update vehicle availability to 'available'
    const vehicleStatus = await BookingService.updateVehicleAvailability(
      existingBooking.vehicle_id,
      'available',
    );

    return SendResponse.success({
      res,
      message: 'Booking marked as returned. Vehicle is now available',
      data: {
        id: updatedBooking.id,
        customer_id: updatedBooking.customer_id,
        vehicle_id: updatedBooking.vehicle_id,
        rent_start_date: existingBooking.rent_start_date,
        rent_end_date: existingBooking.rent_end_date,
        total_price: Number(updatedBooking.total_price),
        status: updatedBooking.status,
        vehicle: {
          availability_status:
            vehicleStatus?.availability_status ?? 'available',
        },
      },
    });
  }

  return SendResponse.badRequest({
    res,
    message: 'Invalid status',
  });
};

export const BookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
