import { Router } from "express";
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  toggleBannerStatus,
  deleteBanner,
} from "../controllers/bannerController.js";
import { verifyAdminToken } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// All routes require admin auth
router.use(verifyAdminToken);

router.get("/", getAllBanners);
router.get("/:id", getBannerById);
router.post("/", createBanner);
router.patch("/:id", updateBanner);
router.patch("/:id/toggle", toggleBannerStatus);
router.delete("/:id", deleteBanner);

export default router;
