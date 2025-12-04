// import  from 'argon2'
import argon from 'argon2';

const hash = async (password: string): Promise<string> => {
    return argon.hash(password, {
        type: argon.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 5,
        parallelism: 1,
    });
};

const verify = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return argon.verify(hashedPassword, password);
};

export const Password = {
    hash,
    verify,
};
