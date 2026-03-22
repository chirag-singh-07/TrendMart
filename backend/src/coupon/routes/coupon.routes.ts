import { Router } from "express";
import { couponController } from "../controllers/coupon.controller.js";
import { couponUsageController } from "../controllers/couponUsage.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import { couponAccessMiddleware } from "../middlewares/couponAccess.middleware.js";
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
  couponFiltersSchema,
  usageFiltersSchema,
} from "../validators/coupon.validator.js";

const router = Router();

// --- Public Routes ---
router.get("/active", couponController.getActiveCoupons);

// --- Buyer Routes ---
router.post(
  "/validate",
  authenticate,
  authorize("buyer"),
  validateRequest(validateCouponSchema),
  couponController.validate,
);

router.get(
  "/quick-check/:code",
  authenticate,
  authorize("buyer"),
  couponController.quickCheck,
);

// --- Admin Routes (/api/admin/coupons) ---
// Note: We define these separately but they can be exported for mounting
const adminRouter = Router();

adminRouter.use(authenticate, authorize("admin", "super_admin", "moderator"));

adminRouter.get(
  "/",
  validateRequest(couponFiltersSchema),
  couponController.getAllCoupons,
);

adminRouter.post(
  "/",
  validateRequest(createCouponSchema),
  couponController.createCoupon,
);

adminRouter.get("/:couponId", couponController.getCouponById);

adminRouter.patch(
  "/:couponId",
  validateRequest(updateCouponSchema),
  couponController.updateCoupon,
);

adminRouter.delete("/:couponId", couponController.deleteCoupon);

adminRouter.patch("/:couponId/toggle", couponController.toggleCoupon);

adminRouter.get("/:couponId/stats", couponController.getCouponStats);

adminRouter.get(
  "/:couponId/usage",
  validateRequest(usageFiltersSchema),
  couponUsageController.getCouponUsage,
);

export const couponRoutes = router;
export const adminCouponRoutes = adminRouter;
