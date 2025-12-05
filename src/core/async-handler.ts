/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENV } from '../config';
import { SendResponse } from './send-response';

export const asyncHandler = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
): T => {
  return (async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorStack = (error as Error).stack || '';

      SendResponse.internalServerError({
        res: args[1],
        message: (error as Error).message,
        errors:
          ENV.NODE_ENV === 'development'
            ? { errorStack }
            : {
                error: 'An unexpected error occurred',
                message: (error as Error).message,
              },
      });
    }
  }) as T;
};
