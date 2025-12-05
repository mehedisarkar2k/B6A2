import type { Role } from '../../config';

export interface Booking {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: Date;
  rent_end_date: Date;
  total_price: number;
  status: 'active' | 'cancelled' | 'returned';
  created_at: Date;
  updated_at: Date;
}

export interface BookingWithCustomer extends Booking {
  customer: {
    name: string;
    email: string;
  };
}

export interface BookingWithVehicle extends Booking {
  vehicle: {
    vehicle_name: string;
    registration_number: string;
    type?: string;
    daily_rent_price?: number;
  };
}

export interface BookingWithDetails extends Booking {
  customer?: {
    name: string;
    email: string;
  };
  vehicle?: {
    vehicle_name: string;
    registration_number: string;
    type?: string;
    daily_rent_price?: number;
    availability_status?: string;
  };
}
