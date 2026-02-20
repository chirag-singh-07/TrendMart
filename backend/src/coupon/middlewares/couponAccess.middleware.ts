import { Request, Response, NextFunction } from "express";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";

/**
 * Middleware to restrict coupon mutations to administrators only
 */
export const couponAccessMiddleware = authorize("admin");
