import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.mdoel";

export const auth_middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from either the cookie or header
    const token = await req.cookies.token;

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);
    if (typeof decodedToken === "string" || !("email" in decodedToken)) {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return res.status(401).json({ error: "Invalid token" });
    }
    // Find the user by decoded token email, exclude certain fields
    const user = await User.findOne({ email: decodedToken.email }).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Store user information in the request object
    req.user = user;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
