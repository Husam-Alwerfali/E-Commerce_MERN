import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../src/models/userModel.js";

interface ExtendRequest extends Request {
    user?: any; // Adjust the type as per your user model
}

const validateJWT  = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    res.status(403).send("No token provided");
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(403).send("Bearer token not found");
    return;
  }

  jwt.verify(token, "D88E1BCAA5BBA1E54A5D95BD2CADD", async (err, payload) => {
    if (err) {
      res.status(403).send("Invalid token");
      return;
    }

    if (!payload) {
      res.status(403).send("Invalid token payload");
      return;
    }
    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };
    //Fetch user from database on the payload
    const  user  = await userModel.findOne({ email: userPayload.email });
    req.user = user;
    next();
  });
};

export default validateJWT;
