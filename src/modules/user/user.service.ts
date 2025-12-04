import { DB_QUERY } from '../../core';
import { CreateUserInput } from './user.schema';
import { User } from './user.types';

const createUser = async (payload: CreateUserInput) => {
    const queryText =
        'INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING id, firstName, lastName, email, role, created_at';
    const queryParams = [
        payload.firstName,
        payload.lastName || null,
        payload.email,
        payload.password,
    ];

    return await DB_QUERY(queryText, queryParams);
};

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
    createUser,
    findUserByEmail,
    findUserByUsername,
};
