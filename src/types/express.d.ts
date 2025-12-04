import type { Role } from '../../config';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: Role;
    };
  }
}
