import { Request, Response, NextFunction } from "express";

import { StatusCodes } from "http-status-codes";

export const error_handler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: error.message || "Internal Server Error" });
};
