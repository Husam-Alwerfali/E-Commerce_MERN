import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../src/models/userModel.js";
import type { ExtendRequest } from "../types/extendedRequest.js";

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  // First check for token in HttpOnly cookie
  let token = req.cookies?.auth_token;

  // If no cookie token, check Authorization header (for backward compatibility)
  if (!token) {
    const authHeader = req.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    res.status(403).json({ error: "No token provided" });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "",
    async (err: any, payload: any) => {
      if (err) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }

      if (!payload) {
        res.status(403).json({ error: "Invalid token payload" });
        return;
      }

      const userPayload = payload as {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };

      // Fetch user from database based on the payload
      const user = await userModel.findOne({ _id: userPayload._id });
      if (!user) {
        res.status(403).json({ error: "User not found" });
        return;
      }

      req.user = user;
      next();
    }
  );
};

export default validateJWT;
