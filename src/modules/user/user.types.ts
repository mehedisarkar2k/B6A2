export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'customer';
  created_at: Date;
  updated_at: Date;
}

export interface UserWithoutPassword {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
}
