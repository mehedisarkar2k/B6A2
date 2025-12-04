import { DB_QUERY } from '../../core';
import type { User } from './user.types';

const findUserByEmail = async (email: string) => {
  const queryText = 'SELECT * FROM users WHERE email = $1';
  const queryParams = [email];

  const result = await DB_QUERY<User>(queryText, queryParams);
  return result.rows[0];
};

const findUserByUsername = async (username: string) => {
  const queryText = 'SELECT * FROM users WHERE username = $1';
  const queryParams = [username];

  const result = await DB_QUERY<User>(queryText, queryParams);
  return result.rows[0];
};

export const UserService = {
  findUserByEmail,
  findUserByUsername,
};
