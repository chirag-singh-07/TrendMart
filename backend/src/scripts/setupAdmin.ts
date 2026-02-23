#!/usr/bin/env node

/**
 * Admin Setup Script
 * This script creates an initial admin user for the TrendMart system
 * 
 * Usage:
 *   npm run create-admin
 *   or
 *   npx tsx src/scripts/setupAdmin.ts
 */

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.model.js";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/trendmart";

interface AdminInput {
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "moderator";
}

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully\n");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:");
    console.error(MONGODB_URI);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Failed to disconnect from MongoDB");
    throw error;
  }
}

/**
 * Get default permissions based on role
 */
function getDefaultPermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    super_admin: [
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
    admin: [
      "view_dashboard",
      "view_analytics",
      "view_users",
      "manage_users",
      "view_products",
      "manage_products",
      "view_orders",
      "manage_orders",
      "view_categories",
      "manage_categories",
      "view_banners",
      "manage_banners",
      "view_logs",
    ],
    moderator: [
      "view_dashboard",
      "view_orders",
      "manage_orders",
      "view_analytics",
    ],
  };

  return permissions[role] || [];
}

/**
 * Create a new admin user
 */
async function createAdmin(adminData: AdminInput) {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log(`⚠️  Admin with email ${adminData.email} already exists`);
      return null;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(adminData.password, 10);

    // Create admin
    const admin = await Admin.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
      permissions: getDefaultPermissions(adminData.role),
      status: "active",
    });

    return admin;
  } catch (error) {
    throw error;
  }
}

/**
 * Main setup function
 */
async function setupAdmin() {
  try {
    // Connect to database
    await connectDB();

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();

    if (adminCount > 0) {
      console.log("ℹ️  Admin users already exist in the database");
      console.log(`   Total admins: ${adminCount}`);

      // List existing admins
      const admins = await Admin.find().select("name email role status");
      console.log("\n📋 Existing admins:");
      admins.forEach((admin) => {
        console.log(
          `   • ${admin.name} (${admin.email}) - ${admin.role} [${admin.status}]`
        );
      });

      await disconnectDB();
      return;
    }

    // Create default super admin
    console.log("👤 Creating default super admin user...\n");

    const defaultAdmin: AdminInput = {
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "super_admin",
    };

    const createdAdmin = await createAdmin(defaultAdmin);

    if (createdAdmin) {
      console.log("✅ Admin user created successfully!");
      console.log("\n📌 Admin Credentials:");
      console.log(`   Email: ${createdAdmin.email}`);
      console.log(`   Password: ${defaultAdmin.password}`);
      console.log(`   Role: ${createdAdmin.role}`);
      console.log("\n⚠️  IMPORTANT:");
      console.log(
        "   Please change this password after your first login!"
      );
      console.log(
        "   Keep these credentials secure and do not share with others."
      );
    }

    await disconnectDB();
  } catch (error) {
    console.error(
      "\n❌ Error during setup:",
      error instanceof Error ? error.message : error
    );
    try {
      await disconnectDB();
    } catch (e) {
      // Ignore disconnect errors
    }
    process.exit(1);
  }
}

// Run setup
console.log("🚀 TrendMart Admin Setup\n");
console.log("━".repeat(50));
setupAdmin().then(() => {
  console.log("━".repeat(50));
  console.log("\n✨ Setup completed!\n");
  process.exit(0);
});
