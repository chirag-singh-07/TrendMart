import { Router } from "express";
import { couponController } from "../controllers/coupon.controller.js";
import { couponUsageController } from "../controllers/couponUsage.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
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
  validate(validateCouponSchema),
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

adminRouter.use(authenticate, authorize("admin"));

adminRouter.get(
  "/",
  validate(couponFiltersSchema),
  couponController.getAllCoupons,
);

adminRouter.post(
  "/",
  validate(createCouponSchema),
  couponController.createCoupon,
);

adminRouter.get("/:couponId", couponController.getCouponById);

adminRouter.patch(
  "/:couponId",
  validate(updateCouponSchema),
  couponController.updateCoupon,
);

adminRouter.delete("/:couponId", couponController.deleteCoupon);

adminRouter.patch("/:couponId/toggle", couponController.toggleCoupon);

adminRouter.get("/:couponId/stats", couponController.getCouponStats);

adminRouter.get(
  "/:couponId/usage",
  validate(usageFiltersSchema),
  couponUsageController.getCouponUsage,
);

export const couponRoutes = router;
export const adminCouponRoutes = adminRouter;
