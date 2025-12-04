export const ROLE = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
