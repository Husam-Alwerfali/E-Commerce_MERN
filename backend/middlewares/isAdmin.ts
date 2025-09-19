import type { Response, NextFunction } from "express";
import type { ExtendRequest } from "../types/extendedRequest.js";

const isAdmin = (req: ExtendRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export default isAdmin;
