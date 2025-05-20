// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an asynchronous route handler to catch any errors and pass them to the next error-handling middleware.
 * @param fn The asynchronous route handler function.
 * @returns A new RequestHandler function that handles asynchronous operations.
 */
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default asyncHandler;
