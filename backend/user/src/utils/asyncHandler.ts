import type { RequestHandler, Request, Response, NextFunction } from "express";

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
};


export default asyncHandler


// In this case , asyncHandler takes a RequestHandler function as an argument and returns a new RequestHandler function that wraps th original handler with error handling logic.

