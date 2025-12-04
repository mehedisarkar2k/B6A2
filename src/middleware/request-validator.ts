
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { Logger, SendResponse } from '../core';

// Type for request data that can contain body, query, and/or params
type RequestData = {
    body?: unknown;
    query?: unknown;
    params?: unknown;
};

// Type guard to check if a value is a ZodObject
function isZodObject(schema: z.ZodType): schema is z.ZodObject<z.ZodRawShape> {
    return schema instanceof z.ZodObject;
}

export const requestValidator = (schema: z.ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if schema is a ZodObject and has shape property
            if (isZodObject(schema)) {
                const shape = schema.shape;
                const hasBody = 'body' in shape;
                const hasQuery = 'query' in shape;
                const hasParams = 'params' in shape;

                // If schema has body/query/params structure, validate accordingly
                if (hasBody || hasQuery || hasParams) {
                    const requestData: RequestData = {};

                    // Only include parts that exist in schema
                    if (hasBody) requestData.body = req.body;
                    if (hasQuery) requestData.query = req.query;
                    if (hasParams) requestData.params = req.params;

                    const validatedData = schema.parse(requestData) as RequestData;

                    // Update request with validated data
                    if (hasBody && validatedData.body !== undefined) {
                        req.body = validatedData.body;
                    }
                    if (hasQuery && validatedData.query !== undefined) {
                        Object.assign(req.query, validatedData.query);
                    }
                    if (hasParams && validatedData.params !== undefined) {
                        Object.assign(req.params, validatedData.params);
                    }

                    return next();
                }
            }

            // For backward compatibility: if schema doesn't have body/query/params structure,
            // assume it's a body-only schema
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        } catch (error) {
            Logger.error(`Validation error: ${JSON.stringify(error)}`);

            if (error instanceof ZodError) {
                // Format Zod validation errors
                const formattedErrors = error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                }));
                return SendResponse.badRequest({
                    res,
                    message: 'Validation failed',
                    data: {
                        error: 'Invalid request data',
                        errors: formattedErrors,
                    },
                });
            }

            return SendResponse.error({
                res,
                message: 'Internal server error during validation',
            });
        }
    };
};
