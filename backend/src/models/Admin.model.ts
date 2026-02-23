import { Schema, model, Document, Types } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "moderator";
  status: "active" | "inactive";
  permissions: string[];
  lastLogin?: Date;
  loginAttempts: number;
  lockoutUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  isLocked(): boolean;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator"],
      default: "admin",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    permissions: [
      {
        type: String,
        enum: [
          "view_dashboard",
          "view_analytics",
          "view_users",
          "manage_users",
          "delete_users",
          "view_products",
          "manage_products",
          "delete_products",
          "view_orders",
          "manage_orders",
          "delete_orders",
          "view_categories",
          "manage_categories",
          "delete_categories",
          "view_banners",
          "manage_banners",
          "delete_banners",
          "view_admins",
          "manage_admins",
          "delete_admins",
          "manage_permissions",
          "view_logs",
          "view_settings",
          "manage_settings",
        ],
      },
    ],
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Only createdAt index — email index is auto-created by unique: true above
AdminSchema.index({ createdAt: -1 });

// ✅ KEY FIX: async pre-hooks must NOT use next() — Mongoose handles promise resolution automatically
AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcryptjs.hash(this.password, 10);
});

AdminSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

AdminSchema.methods.incLoginAttempts = async function (): Promise<void> {
  if (this.lockoutUntil && this.lockoutUntil < new Date()) {
    await this.updateOne({
      $set: { loginAttempts: 1, lockoutUntil: null },
    });
    return;
  }

  const updateObj: Record<string, any> = {
    $inc: { loginAttempts: 1 },
  };

  const maxAttempts = 5;
  const lockTimeMinutes = 30;

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updateObj["$set"] = {
      lockoutUntil: new Date(Date.now() + lockTimeMinutes * 60 * 1000),
    };
  }

  await this.updateOne(updateObj);
};

AdminSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  await this.updateOne({
    $set: { loginAttempts: 0, lockoutUntil: null },
  });
};

AdminSchema.methods.isLocked = function (): boolean {
  return !!(this.lockoutUntil && this.lockoutUntil > new Date());
};

AdminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Admin = model<IAdmin>("Admin", AdminSchema);

export default Admin;