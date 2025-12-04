import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

const hash = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

const verify = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const Password = {
    hash,
    verify,
};
