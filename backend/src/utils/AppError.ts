/**
 * Structured application error carrying an HTTP status code.
 * Throw this anywhere in the service layer — the centralized error
 * handler in the controller will catch it and respond correctly.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: any[];

  constructor(message: string, statusCode: number = 500, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes known errors from unexpected crashes
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype); // restore prototype chain
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
