import type { Response } from 'express';

import * as status from './status-code';

type SendResponseProps<T> = {
    res: Response;
    data?: T;
    message?: string;
};

class SendResponse {
    private static sendResponse<T>(
        res: Response,
        statusCode: number,
        { data, message }: SendResponseProps<T>,
        success: boolean = true
    ) {
        return res.status(statusCode).json({
            success,
            message,
            data,
        });
    }

    // Success responses
    static success<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.OK, props);
    }

    static created<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.CREATED, props);
    }

    static updated<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.OK, props);
    }

    static deleted(props: SendResponseProps<undefined>) {
        return this.sendResponse(props.res, status.OK, props);
    }

    // Error responses
    static error<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.BAD_REQUEST, props, false);
    }

    // 409 Conflict
    static conflict<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.CONFLICT, props, false);
    }

    // 401 Unauthorized
    static unauthorized<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.UNAUTHORIZED, props, false);
    }

    // 400 Bad Request
    static badRequest<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.BAD_REQUEST, props, false);
    }

    // 403 Forbidden
    static forbidden<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.FORBIDDEN, props, false);
    }

    // 404 Not Found
    static notFound<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.NOT_FOUND, props, false);
    }

    // 422 Unprocessable Entity
    static unprocessableEntity<T>(props: SendResponseProps<T>) {
        return this.sendResponse(
            props.res,
            status.UNPROCESSABLE_ENTITY,
            props,
            false
        );
    }

    // 429 Too Many Requests
    static tooManyRequests<T>(props: SendResponseProps<T>) {
        return this.sendResponse(props.res, status.TOO_MANY_REQUESTS, props, false);
    }

    // 500 Internal Server Error
    static internalServerError<T>(props: SendResponseProps<T>) {
        return this.sendResponse(
            props.res,
            status.INTERNAL_SERVER_ERROR,
            props,
            false
        );
    }

    // 503 Service Unavailable
    static serviceUnavailable<T>(props: SendResponseProps<T>) {
        return this.sendResponse(
            props.res,
            status.SERVICE_UNAVAILABLE,
            props,
            false
        );
    }
}

export { SendResponse };
