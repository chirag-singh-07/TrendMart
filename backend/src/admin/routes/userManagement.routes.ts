import { Router } from "express";
import { 
  getAllUsers, 
  updateUserStatus, 
  deleteUser 
} from "../controllers/userManagementController.js";
import { verifyAdminToken } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// Middleware: Admin Only
router.use(verifyAdminToken);

// Route definition
router.get("/", getAllUsers);
router.patch("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

export default router;
