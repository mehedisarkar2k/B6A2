import type { Request, Response } from 'express';
import { SendResponse } from '../../core';
import { VehicleZodSchema } from './vehicles.schema';
import { VehicleService } from './vehicles.service';

const createVehicle = async (req: Request, res: Response) => {
  const payload = VehicleZodSchema.CreateVehicleSchema.parse(req.body);

  // Check if registration number already exists
  const existingVehicle = await VehicleService.getVehicleByRegistrationNumber(
    payload.registration_number,
  );
  if (existingVehicle) {
    return SendResponse.conflict({
      res,
      message: 'Vehicle with this registration number already exists',
    });
  }

  const vehicle = await VehicleService.createVehicle(payload);

  if (!vehicle) {
    return SendResponse.internalServerError({
      res,
      message: 'Failed to create vehicle',
    });
  }

  return SendResponse.created({
    res,
    message: 'Vehicle created successfully',
    data: {
      id: vehicle.id,
      vehicle_name: vehicle.vehicle_name,
      type: vehicle.type,
      registration_number: vehicle.registration_number,
      daily_rent_price: Number(vehicle.daily_rent_price),
      availability_status: vehicle.availability_status,
    },
  });
};

const getAllVehicles = async (_req: Request, res: Response) => {
  const vehicles = await VehicleService.getAllVehicles();

  if (vehicles.length === 0) {
    return SendResponse.success({
      res,
      message: 'No vehicles found',
      data: [],
    });
  }

  return SendResponse.success({
    res,
    message: 'Vehicles retrieved successfully',
    data: vehicles.map((vehicle) => ({
      id: vehicle.id,
      vehicle_name: vehicle.vehicle_name,
      type: vehicle.type,
      registration_number: vehicle.registration_number,
      daily_rent_price: Number(vehicle.daily_rent_price),
      availability_status: vehicle.availability_status,
    })),
  });
};

const getVehicleById = async (req: Request, res: Response) => {
  const { vehicleId } = VehicleZodSchema.VehicleIdParamSchema.parse(req.params);

  const vehicle = await VehicleService.getVehicleById(Number(vehicleId));

  if (!vehicle) {
    return SendResponse.notFound({
      res,
      message: 'Vehicle not found',
    });
  }

  return SendResponse.success({
    res,
    message: 'Vehicle retrieved successfully',
    data: {
      id: vehicle.id,
      vehicle_name: vehicle.vehicle_name,
      type: vehicle.type,
      registration_number: vehicle.registration_number,
      daily_rent_price: Number(vehicle.daily_rent_price),
      availability_status: vehicle.availability_status,
    },
  });
};

const updateVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = VehicleZodSchema.VehicleIdParamSchema.parse(req.params);
  const payload = VehicleZodSchema.UpdateVehicleSchema.parse(req.body);

  // Check if vehicle exists
  const existingVehicle = await VehicleService.getVehicleById(
    Number(vehicleId),
  );
  if (!existingVehicle) {
    return SendResponse.notFound({
      res,
      message: 'Vehicle not found',
    });
  }

  // Check if new registration number conflicts with another vehicle
  if (
    payload.registration_number &&
    payload.registration_number !== existingVehicle.registration_number
  ) {
    const conflictVehicle = await VehicleService.getVehicleByRegistrationNumber(
      payload.registration_number,
    );
    if (conflictVehicle) {
      return SendResponse.conflict({
        res,
        message: 'Vehicle with this registration number already exists',
      });
    }
  }

  const vehicle = await VehicleService.updateVehicle(
    Number(vehicleId),
    payload,
  );

  if (!vehicle) {
    return SendResponse.internalServerError({
      res,
      message: 'Failed to update vehicle',
    });
  }

  return SendResponse.success({
    res,
    message: 'Vehicle updated successfully',
    data: {
      id: vehicle.id,
      vehicle_name: vehicle.vehicle_name,
      type: vehicle.type,
      registration_number: vehicle.registration_number,
      daily_rent_price: Number(vehicle.daily_rent_price),
      availability_status: vehicle.availability_status,
    },
  });
};

const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = VehicleZodSchema.VehicleIdParamSchema.parse(req.params);

  // Check if vehicle exists
  const existingVehicle = await VehicleService.getVehicleById(
    Number(vehicleId),
  );
  if (!existingVehicle) {
    return SendResponse.notFound({
      res,
      message: 'Vehicle not found',
    });
  }

  // Check if vehicle has active bookings
  const hasActiveBookings = await VehicleService.hasActiveBookings(
    Number(vehicleId),
  );
  if (hasActiveBookings) {
    return SendResponse.badRequest({
      res,
      message: 'Cannot delete vehicle with active bookings',
    });
  }

  const deleted = await VehicleService.deleteVehicle(Number(vehicleId));

  if (!deleted) {
    return SendResponse.internalServerError({
      res,
      message: 'Failed to delete vehicle',
    });
  }

  return SendResponse.success({
    res,
    message: 'Vehicle deleted successfully',
  });
};

export const VehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
