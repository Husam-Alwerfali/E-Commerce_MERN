import type { Request } from "express";

export interface ExtendRequest extends Request {
    user?: any; // Adjust the type as per your user model
}