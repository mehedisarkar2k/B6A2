import type { Role } from '../../config';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithoutPassword {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
}
