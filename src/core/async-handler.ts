import { ENV } from '../config';
import { SendResponse } from './send-response';

export const asyncHandler = <T extends (...args: any[]) => Promise<any>>(
    fn: T
): T => {
    return (async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
        try {
            return await fn(...args);
        } catch (error) {
            const errorStack = (error as Error).stack || '';

            SendResponse.internalServerError({
                res: args[1],
                message: (error as Error).message,
                data: ENV.NODE_ENV === 'development' ? { errorStack } : undefined,
            });
        }
    }) as T;
};
