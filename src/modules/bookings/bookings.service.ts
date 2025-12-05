import { DB_QUERY } from '../../core';
import type { Booking } from './bookings.types';
import type { CreateBookingInput } from './bookings.schema';

const createBooking = async (
  payload: CreateBookingInput & { total_price: number },
) => {
  const queryText = `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
  `;
  const queryParams = [
    payload.customer_id,
    payload.vehicle_id,
    payload.rent_start_date,
    payload.rent_end_date,
    payload.total_price,
  ];

  const result = await DB_QUERY<Booking>(queryText, queryParams);
  return result.rows[0];
};

const getBookingById = async (bookingId: number) => {
  const queryText = `
    SELECT id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    FROM bookings
    WHERE id = $1
  `;

  const result = await DB_QUERY<Booking>(queryText, [bookingId]);
  return result.rows[0];
};

const getAllBookingsForAdmin = async () => {
  const queryText = `
    SELECT 
      b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
      u.name as customer_name, u.email as customer_email,
      v.vehicle_name, v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id DESC
  `;

  const result = await DB_QUERY(queryText);
  return result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: Number(row.total_price),
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));
};

const getBookingsForCustomer = async (customerId: number) => {
  const queryText = `
    SELECT 
      b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
      v.vehicle_name, v.registration_number, v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
  `;

  const result = await DB_QUERY(queryText, [customerId]);
  return result.rows.map((row) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: Number(row.total_price),
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

const updateBookingStatus = async (
  bookingId: number,
  status: 'cancelled' | 'returned',
) => {
  const queryText = `
    UPDATE bookings
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
  `;

  const result = await DB_QUERY<Booking>(queryText, [status, bookingId]);
  return result.rows[0];
};

const updateVehicleAvailability = async (
  vehicleId: number,
  status: 'available' | 'booked',
) => {
  const queryText = `
    UPDATE vehicles
    SET availability_status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING availability_status
  `;

  const result = await DB_QUERY(queryText, [status, vehicleId]);
  return result.rows[0];
};

const getVehicleById = async (vehicleId: number) => {
  const queryText = `
    SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    FROM vehicles
    WHERE id = $1
  `;

  const result = await DB_QUERY(queryText, [vehicleId]);
  return result.rows[0];
};

const getCustomerById = async (customerId: number) => {
  const queryText = `
    SELECT id, name, email, phone, role
    FROM users
    WHERE id = $1
  `;

  const result = await DB_QUERY(queryText, [customerId]);
  return result.rows[0];
};

const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const BookingService = {
  createBooking,
  getBookingById,
  getAllBookingsForAdmin,
  getBookingsForCustomer,
  updateBookingStatus,
  updateVehicleAvailability,
  getVehicleById,
  getCustomerById,
  calculateDaysBetween,
};
