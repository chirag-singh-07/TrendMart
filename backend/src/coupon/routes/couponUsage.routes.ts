import { Router } from "express";
import { couponUsageController } from "../controllers/couponUsage.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { usageFiltersSchema } from "../validators/coupon.validator.js";

const router = Router();

router.use(authenticate);
router.use(authorize("buyer"));

router.get(
  "/history",
  validate(usageFiltersSchema),
  couponUsageController.getMyHistory,
);

router.get("/remaining/:couponId", couponUsageController.getRemainingUsage);

export default router;
