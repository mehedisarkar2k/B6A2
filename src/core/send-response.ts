import type { Response } from 'express';

import * as status from './status-code';

type SendResponseProps<T> = {
  res: Response;
  data?: T;
  message?: string;
};

type SendErrorResponseProps = {
  res: Response;
  message?: string;
  errors?: unknown;
};

class SendResponse {
  private static sendResponse<T>(
    res: Response,
    statusCode: number,
    { data, message }: SendResponseProps<T>,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  private static sendErrorResponse(
    res: Response,
    statusCode: number,
    { message, errors }: SendErrorResponseProps,
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors ?? message,
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
  static error(props: SendErrorResponseProps) {
    return this.sendErrorResponse(props.res, status.BAD_REQUEST, props);
  }

  // 409 Conflict
  static conflict(props: SendErrorResponseProps) {
    return this.sendErrorResponse(props.res, status.CONFLICT, props);
  }

  // 401 Unauthorized
  static unauthorized(props: SendErrorResponseProps) {
    return this.sendErrorResponse(props.res, status.UNAUTHORIZED, props);
  }

  // 400 Bad Request
  static badRequest(props: SendErrorResponseProps) {
    return this.sendErrorResponse(props.res, status.BAD_REQUEST, props);
  }

  // 403 Forbidden
  static forbidden(props: SendErrorResponseProps) {
    return this.sendErrorResponse(props.res, status.FORBIDDEN, props);
  }

  // 404 Not Found
  static notFound(props: SendErrorResponseProps) {
    return this.sendErrorResponse(props.res, status.NOT_FOUND, props);
  }

  // 422 Unprocessable Entity
  static unprocessableEntity(props: SendErrorResponseProps) {
    return this.sendErrorResponse(
      props.res,
      status.UNPROCESSABLE_ENTITY,
      props,
    );
  }

  // 429 Too Many Requests
  static tooManyRequests(props: SendErrorResponseProps) {
    return this.sendErrorResponse(props.res, status.TOO_MANY_REQUESTS, props);
  }

  // 500 Internal Server Error
  static internalServerError(props: SendErrorResponseProps) {
    return this.sendErrorResponse(
      props.res,
      status.INTERNAL_SERVER_ERROR,
      props,
    );
  }

  // 503 Service Unavailable
  static serviceUnavailable(props: SendErrorResponseProps) {
    return this.sendErrorResponse(props.res, status.SERVICE_UNAVAILABLE, props);
  }
}

export { SendResponse };
