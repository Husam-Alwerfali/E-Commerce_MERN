import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../src/models/userModel.js";
import type { ExtendRequest } from "../types/extendedRequest.js";

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    res.status(403).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(403).json({ error: "Bearer token not found" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || "", async (err, payload) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }

    if (!payload) {
      res.status(403).json({ error: "Invalid token payload" });
      return;
    }

    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };

    // Fetch user from database based on the payload
    const user = await userModel.findOne({ email: userPayload.email });
    if (!user) {
      res.status(403).json({ error: "User not found" });
      return;
    }

    req.user = user;
    next();
  });
};

export default validateJWT;
