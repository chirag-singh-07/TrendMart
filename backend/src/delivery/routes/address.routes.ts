import { Router } from "express";
import { addressController } from "../controllers/address.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "../validators/address.validator.js";
import { addressOwner } from "../middlewares/addressOwner.middleware.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize("buyer", "admin"));

router.get("/", addressController.getUserAddresses);
router.post(
  "/",
  validate(createAddressSchema),
  addressController.createAddress,
);

router.get("/:addressId", addressOwner, addressController.getAddressById);
router.patch(
  "/:addressId",
  addressOwner,
  validate(updateAddressSchema),
  addressController.updateAddress,
);
router.delete("/:addressId", addressOwner, addressController.deleteAddress);
router.patch(
  "/:addressId/set-default",
  addressOwner,
  addressController.setDefaultAddress,
);

export default router;
