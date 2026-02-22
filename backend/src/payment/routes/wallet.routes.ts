import { Router } from "express";
import { walletController } from "../controllers/wallet.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  topUpSchema,
  adminCreditSchema,
} from "../validators/wallet.validator.js";

const router = Router();

// Buyer + Seller: wallet summary and transactions
router.get(
  "/",
  authenticate,
  authorize("buyer", "seller"),
  walletController.getWalletSummary,
);

router.get(
  "/transactions",
  authenticate,
  authorize("buyer", "seller"),
  walletController.getTransactionHistory,
);

router.post(
  "/topup",
  authenticate,
  authorize("buyer"),
  validate(topUpSchema),
  walletController.topUpWallet,
);

router.post(
  "/topup/confirm",
  authenticate,
  authorize("buyer"),
  walletController.confirmTopUp,
);

// Admin credit
router.post(
  "/admin/credit",
  authenticate,
  authorize("admin"),
  validate(adminCreditSchema),
  walletController.adminCreditWallet,
);

export default router;
