import { DB_QUERY } from '../../core';
import type { Vehicle } from './vehicles.types';
import type { CreateVehicleInput, UpdateVehicleInput } from './vehicles.schema';

const createVehicle = async (payload: CreateVehicleInput) => {
  const queryText = `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
  `;
  const queryParams = [
    payload.vehicle_name,
    payload.type,
    payload.registration_number,
    payload.daily_rent_price,
    payload.availability_status || 'available',
  ];

  const result = await DB_QUERY<Vehicle>(queryText, queryParams);
  return result.rows[0];
};

const getAllVehicles = async () => {
  const queryText = `
    SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    FROM vehicles
    ORDER BY id ASC
  `;

  const result = await DB_QUERY<Vehicle>(queryText);
  return result.rows;
};

const getVehicleById = async (vehicleId: number) => {
  const queryText = `
    SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    FROM vehicles
    WHERE id = $1
  `;

  const result = await DB_QUERY<Vehicle>(queryText, [vehicleId]);
  return result.rows[0];
};

const getVehicleByRegistrationNumber = async (registrationNumber: string) => {
  const queryText = `
    SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    FROM vehicles
    WHERE registration_number = $1
  `;

  const result = await DB_QUERY<Vehicle>(queryText, [registrationNumber]);
  return result.rows[0];
};

const updateVehicle = async (
  vehicleId: number,
  payload: UpdateVehicleInput,
) => {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (payload.vehicle_name !== undefined) {
    updates.push(`vehicle_name = $${paramIndex++}`);
    values.push(payload.vehicle_name);
  }
  if (payload.type !== undefined) {
    updates.push(`type = $${paramIndex++}`);
    values.push(payload.type);
  }
  if (payload.registration_number !== undefined) {
    updates.push(`registration_number = $${paramIndex++}`);
    values.push(payload.registration_number);
  }
  if (payload.daily_rent_price !== undefined) {
    updates.push(`daily_rent_price = $${paramIndex++}`);
    values.push(payload.daily_rent_price);
  }
  if (payload.availability_status !== undefined) {
    updates.push(`availability_status = $${paramIndex++}`);
    values.push(payload.availability_status);
  }

  if (updates.length === 0) {
    return getVehicleById(vehicleId);
  }

  updates.push(`updated_at = NOW()`);
  values.push(vehicleId);

  const queryText = `
    UPDATE vehicles
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
  `;

  const result = await DB_QUERY<Vehicle>(queryText, values);
  return result.rows[0];
};

const deleteVehicle = async (vehicleId: number) => {
  const queryText = `DELETE FROM vehicles WHERE id = $1`;
  const result = await DB_QUERY(queryText, [vehicleId]);
  return result.rowCount && result.rowCount > 0;
};

const hasActiveBookings = async (vehicleId: number) => {
  const queryText = `
    SELECT COUNT(*) as count
    FROM bookings
    WHERE vehicle_id = $1 AND status = 'active'
  `;

  const result = await DB_QUERY<{ count: string }>(queryText, [vehicleId]);
  return parseInt(result.rows[0]?.count ?? '0', 10) > 0;
};

export const VehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  getVehicleByRegistrationNumber,
  updateVehicle,
  deleteVehicle,
  hasActiveBookings,
};
