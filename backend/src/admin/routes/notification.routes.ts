import { Router } from "express";
import { 
  getAllNotifications, 
  sendNotification, 
  deleteNotification 
} from "../controllers/notificationController.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";

const router = Router();

// Middleware: Admin Only
router.use(authenticate, authorize("admin", "super_admin", "moderator"));

// Route definition
router.get("/", getAllNotifications);
router.post("/send", sendNotification);
router.delete("/:id", deleteNotification);

export default router;
