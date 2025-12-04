import JWT from 'jsonwebtoken';
import { ENV } from '../config';

const sign = (payload: Record<string, unknown>) => {
    const token = JWT.sign(payload, ENV.JWT_SECRET_KEY, {
        expiresIn: '1h',
    });

    return token;
};

const singRefreshToken = async (payload: Record<string, unknown>) => {
    const token = JWT.sign({ payload }, ENV.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: '30d',
    });

    // TODO: store refresh token in DB (for rotation, logout, revocation)
    return token;
};

const generateTokens = async (payload: Record<string, unknown>) => {
    const accessToken = sign(payload);
    const refreshToken = await singRefreshToken(payload);

    return { accessToken, refreshToken };
}

const verify = <T>(token: string): T => {
    try {
        const decoded = JWT.verify(token, ENV.JWT_SECRET_KEY);

        return decoded as T;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const refreshToken = (refreshToken: string) => {
    try {
        const decoded = JWT.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET_KEY) as {
            payload: Record<string, unknown>;
        };

        // TODO: verify refresh token exists in DB and is still valid

        const newAccessToken = JWT.sign(decoded.payload, ENV.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });

        const newRefreshToken = JWT.sign(
            { payload: decoded.payload },
            ENV.REFRESH_TOKEN_SECRET_KEY,
            {
                expiresIn: '30d',
            }
        );

        // TODO: rotate refresh token in DB (remove old, save new)

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

export const JWTToken = {
    sign,
    verify,
    singRefreshToken,
    refreshToken,
    generateTokens
};
