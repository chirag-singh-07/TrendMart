import mongoose, { Schema, model, Document } from "mongoose";
import { IAuditLog, ActorRole, AuditActionType } from "../interfaces";

// ==================== AuditLog Model ====================
// This collection should be append-only. Never update or delete audit logs.

export interface IAuditLogDocument extends IAuditLog, Document {}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorRole: {
      type: String,
      enum: ["admin", "seller", "buyer", "system"] satisfies ActorRole[],
      required: true,
    },
    actionType: {
      type: String,
      enum: [
        "create",
        "update",
        "delete",
        "login",
        "logout",
        "ban",
        "approve",
        "reject",
      ] satisfies AuditActionType[],
      required: true,
    },
    targetModel: { type: String, required: true }, // e.g. "Product", "User"
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    previousData: {
      type: Schema.Types.Mixed, // state before change
    },
    newData: {
      type: Schema.Types.Mixed, // state after change
    },
    ipAddress: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// admin dashboard — filter by actor or action type
AuditLogSchema.index({ actorId: 1, createdAt: -1 });

// compliance — all actions on a specific document
AuditLogSchema.index({ targetModel: 1, targetId: 1 });

// security — filter by action type
AuditLogSchema.index({ actionType: 1 });

// TTL — auto-delete logs older than 2 years (adjust per compliance needs)
AuditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 365 * 2 },
);

const AuditLog =
  mongoose.models.AuditLog ||
  model<IAuditLogDocument>("AuditLog", AuditLogSchema);

export default AuditLog;
