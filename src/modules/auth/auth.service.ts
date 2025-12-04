import { Password } from '../../core';
import { JWTToken } from '../../core/jwt-token';
import type { User } from '../user/user.types';
import type { LoginInput } from './auth.schema';

const login = async (
  payload: LoginInput,
  user: User,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const { password } = payload;
  const isPasswordValid = Password.verify(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const tokens = JWTToken.generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return tokens;
};

export const AuthService = {
  login,
};
