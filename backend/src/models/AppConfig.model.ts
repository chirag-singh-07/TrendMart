import mongoose, { Schema, model, Document } from "mongoose";
import { IAppConfig } from "../interfaces";

// ==================== AppConfig Model ====================
// Intended to hold exactly one document — a singleton config for the app.

export interface IAppConfigDocument extends IAppConfig, Document {}

const AppConfigSchema = new Schema<IAppConfigDocument>(
  {
    appName: { type: String, required: true, default: "EcoomApp" },
    version: { type: String, required: true }, // e.g. "2.4.1"
    maintenanceMode: { type: Boolean, default: false },
    forceUpdate: { type: Boolean, default: false },
    minSupportedVersion: { type: String, required: true }, // e.g. "2.0.0"
    featureFlags: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

const AppConfig =
  mongoose.models.AppConfig ||
  model<IAppConfigDocument>("AppConfig", AppConfigSchema);

export default AppConfig;
