import { Router } from "express";
import { deliveryPartnerController } from "../controllers/deliveryPartner.controller.js";
import { trackingController } from "../controllers/tracking.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  updateProfileSchema,
  updateAvailabilitySchema,
  locationUpdateSchema,
} from "../validators/deliveryPartner.validator.js";

const router = Router();

router.use(authenticate);

// Partner self-management
router.get(
  "/me",
  authorize("delivery"),
  deliveryPartnerController.getOwnProfile,
);
router.patch(
  "/me",
  authorize("delivery"),
  validate(updateProfileSchema),
  deliveryPartnerController.updateOwnProfile,
);
router.patch(
  "/me/availability",
  authorize("delivery"),
  validate(updateAvailabilitySchema),
  deliveryPartnerController.updateAvailability,
);
router.post(
  "/me/location",
  authorize("delivery"),
  validate(locationUpdateSchema),
  trackingController.updateLiveLocation,
);
router.get(
  "/me/assignments",
  authorize("delivery"),
  deliveryPartnerController.getOwnAssignments,
);
router.get(
  "/me/stats",
  authorize("delivery"),
  deliveryPartnerController.getOwnStats,
);

// Admin partner management
router.get("/", authorize("admin"), deliveryPartnerController.getAllPartners);
router.get(
  "/available",
  authorize("admin"),
  deliveryPartnerController.getAvailablePartners,
);
router.get(
  "/:partnerId",
  authorize("admin"),
  deliveryPartnerController.getPartnerDetail,
);
router.patch(
  "/:partnerId",
  authorize("admin"),
  validate(updateProfileSchema),
  deliveryPartnerController.updatePartnerAdmin,
);

export default router;
