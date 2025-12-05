import { DB_QUERY } from '../../core';
import type { User, UserWithoutPassword } from './user.types';
import type { UpdateUserInput } from './user.schema';

const findUserByEmail = async (email: string) => {
  const queryText = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
  const queryParams = [email];

  const result = await DB_QUERY<User>(queryText, queryParams);
  return result.rows[0];
};

const findUserById = async (id: number) => {
  const queryText = 'SELECT * FROM users WHERE id = $1';
  const queryParams = [id];

  const result = await DB_QUERY<User>(queryText, queryParams);
  return result.rows[0];
};

const getAllUsers = async () => {
  const queryText = `
    SELECT id, name, email, phone, role
    FROM users
    ORDER BY id ASC
  `;

  const result = await DB_QUERY<UserWithoutPassword>(queryText);
  return result.rows;
};

const updateUser = async (userId: number, payload: UpdateUserInput) => {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (payload.name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(payload.name);
  }
  if (payload.email !== undefined) {
    updates.push(`email = $${paramIndex++}`);
    values.push(payload.email.toLowerCase());
  }
  if (payload.phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`);
    values.push(payload.phone);
  }
  if (payload.role !== undefined) {
    updates.push(`role = $${paramIndex++}`);
    values.push(payload.role);
  }

  if (updates.length === 0) {
    // No updates, return current user
    const user = await findUserById(userId);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    } as UserWithoutPassword;
  }

  updates.push(`updated_at = NOW()`);
  values.push(userId);

  const queryText = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, name, email, phone, role
  `;

  const result = await DB_QUERY<UserWithoutPassword>(queryText, values);
  return result.rows[0];
};

const deleteUser = async (userId: number) => {
  const queryText = `DELETE FROM users WHERE id = $1`;
  const result = await DB_QUERY(queryText, [userId]);
  return result.rowCount && result.rowCount > 0;
};

const hasActiveBookings = async (userId: number) => {
  const queryText = `
    SELECT COUNT(*) as count
    FROM bookings
    WHERE customer_id = $1 AND status = 'active'
  `;

  const result = await DB_QUERY<{ count: string }>(queryText, [userId]);
  return parseInt(result.rows[0]?.count ?? '0', 10) > 0;
};

export const UserService = {
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  hasActiveBookings,
};
