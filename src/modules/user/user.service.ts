import { DB_QUERY } from '../../core';
import type { User } from './user.types';

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

export const UserService = {
  findUserByEmail,
  findUserById,
};
