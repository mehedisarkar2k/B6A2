import { Router } from 'express';
import { asyncHandler } from '../../core';
import { requestValidator, roleValidator } from '../../middleware';
import { VehicleController } from './vehicles.controller';
import { VehicleZodSchema } from './vehicles.schema';
import { ROLE } from '../../config';

const router = Router();

// POST /api/v1/vehicles - Create vehicle (Admin only)
router.post(
  '/',
  roleValidator(ROLE.ADMIN),
  requestValidator(VehicleZodSchema.CreateVehicleSchema),
  asyncHandler(VehicleController.createVehicle),
);

// GET /api/v1/vehicles - Get all vehicles (Public)
router.get('/', asyncHandler(VehicleController.getAllVehicles));

// GET /api/v1/vehicles/:vehicleId - Get vehicle by ID (Public)
router.get('/:vehicleId', asyncHandler(VehicleController.getVehicleById));

// PUT /api/v1/vehicles/:vehicleId - Update vehicle (Admin only)
router.put(
  '/:vehicleId',
  roleValidator(ROLE.ADMIN),
  requestValidator(VehicleZodSchema.UpdateVehicleSchema),
  asyncHandler(VehicleController.updateVehicle),
);

// DELETE /api/v1/vehicles/:vehicleId - Delete vehicle (Admin only)
router.delete(
  '/:vehicleId',
  roleValidator(ROLE.ADMIN),
  asyncHandler(VehicleController.deleteVehicle),
);

export { router as VehiclesRoutes };
