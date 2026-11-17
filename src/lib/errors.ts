export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 404, true, { resource, id });
  }
}

export class ExternalServiceError extends AppError {
  constructor(serviceName: string, cause: Error) {
    super(`${serviceName} failed: ${cause.message}`, 502, true, {
      serviceName,
      cause: cause.message,
    });
    this.cause = cause;
  }
}

export class ValidationError extends AppError {
  constructor(field: string, reason: string) {
    super(`Validation error on ${field}: ${reason}`, 400, true, {
      field,
      reason,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, 403, true);
  }
}

export class ConflictError extends AppError {
  constructor(resource: string, id: string) {
    super(`Conflict error on ${resource}: ${id}`, 409, true, { resource, id });
  }
}
