import { Request, Response, NextFunction } from "express";
import Notification from "../../models/Notification.model.js";
import User from "../../models/User.model.js";
import { sendAnnouncementEmail } from "../../auth/services/email.service.js";

interface AuthRequest extends Request {
  admin?: any;
  adminId?: string;
}

// ── Get all notification history ─────────────────────────────────────────────
export const getAllNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const notifications = await Notification.find()
      .populate("userId", "firstName lastName email")
      .sort({ sentAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// ── Send Notification (Broadcast or Targeted) ───────────────────────────────
export const sendNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, message, type, targetType, userIds, sendEmail, sendPush } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title and message are required" });
    }

    // 1. Identify Target Users
    let query: any = { accountStatus: "active" };
    if (targetType === "buyers") query.role = "buyer";
    if (targetType === "sellers") query.role = "seller";
    if (targetType === "selective" && userIds) query._id = { $in: userIds };

    const users = await User.find(query).select("email firstName lastName");

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found for the selected target" });
    }

    // 2. Save Notification to DB for each user (for in-app history)
    const notificationsToCreate = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: type || "promo",
      sentAt: new Date(),
    }));

    await Notification.insertMany(notificationsToCreate);

    // 3. Send Emails asynchronously if requested
    if (sendEmail) {
      // In a production app, this would be a background job (BullMQ/Redis)
      // For now, we'll process it in chunks to avoid blocking too long
      const emailTasks = users.map(user => 
        sendAnnouncementEmail(user.email, title, `Hello ${user.firstName}, New Update!`, message)
          .catch(err => console.error(`Failed to send email to ${user.email}:`, err))
      );
      
      // We don't await ALL at once to return response faster, but we trigger them
      Promise.all(emailTasks).then(() => console.log(`Finished sending ${users.length} announcement emails`));
    }

    res.status(200).json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      recipientCount: users.length
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Notification History Entry ────────────────────────────────────────
export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Notification entry removed",
    });
  } catch (error) {
    next(error);
  }
};
