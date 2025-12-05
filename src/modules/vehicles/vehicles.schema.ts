import { z } from 'zod';

const CreateVehicleSchema = z.object({
  vehicle_name: z.string().min(1).max(100).trim(),
  type: z.enum(['car', 'bike', 'van', 'SUV']),
  registration_number: z.string().min(1).max(50).trim(),
  daily_rent_price: z.number().positive(),
  availability_status: z.enum(['available', 'booked']).default('available'),
});
export type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>;

const UpdateVehicleSchema = z.object({
  vehicle_name: z.string().min(1).max(100).trim().optional(),
  type: z.enum(['car', 'bike', 'van', 'SUV']).optional(),
  registration_number: z.string().min(1).max(50).trim().optional(),
  daily_rent_price: z.number().positive().optional(),
  availability_status: z.enum(['available', 'booked']).optional(),
});
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleSchema>;

const VehicleIdParamSchema = z.object({
  vehicleId: z.string().regex(/^\d+$/, 'Vehicle ID must be a number'),
});
export type VehicleIdParam = z.infer<typeof VehicleIdParamSchema>;

export const VehicleZodSchema = {
  CreateVehicleSchema,
  UpdateVehicleSchema,
  VehicleIdParamSchema,
};
