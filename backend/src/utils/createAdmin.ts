import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.model";

/**
 * Create a new admin user in the database
 * This script can be run directly or imported as a module
 */

interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "moderator";
  permissions?: string[];
}

/**
 * Create a single admin user
 */
export const createAdminUser = async (data: CreateAdminInput) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: data.email });
    if (existingAdmin) {
      throw new Error(`Admin with email ${data.email} already exists`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create admin user
    const admin = await Admin.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      permissions: data.permissions || getDefaultPermissions(data.role),
      status: "active",
      createdAt: new Date(),
    });

    console.log(`✅ Admin user created successfully`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);

    return admin;
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error.message);
    throw error;
  }
};

/**
 * Create multiple admin users
 */
export const createMultipleAdmins = async (
  admins: CreateAdminInput[]
) => {
  try {
    const createdAdmins = [];

    for (const adminData of admins) {
      try {
        const admin = await createAdminUser(adminData);
        createdAdmins.push(admin);
      } catch (error: any) {
        console.error(
          `⚠️  Failed to create admin ${adminData.email}:`,
          error.message
        );
      }
    }

    console.log(
      `\n✅ Successfully created ${createdAdmins.length} of ${admins.length} admin users`
    );
    return createdAdmins;
  } catch (error: any) {
    console.error("❌ Error creating multiple admins:", error.message);
    throw error;
  }
};

/**
 * Get default permissions based on role
 */
const getDefaultPermissions = (role: string): string[] => {
  const basePermissions = [
    "view_dashboard",
    "view_orders",
    "view_products",
  ];

  const rolePermissions: Record<string, string[]> = {
    super_admin: [
      ...basePermissions,
      "manage_users",
      "manage_admins",
      "manage_products",
      "manage_orders",
      "manage_categories",
      "manage_banners",
      "manage_settings",
      "view_analytics",
      "manage_permissions",
      "view_logs",
      "delete_users",
      "delete_products",
      "delete_orders",
    ],
    admin: [
      ...basePermissions,
      "manage_users",
      "manage_products",
      "manage_orders",
      "manage_categories",
      "manage_banners",
      "view_analytics",
      "view_logs",
    ],
    moderator: [
      ...basePermissions,
      "manage_orders",
      "view_analytics",
    ],
  };

  return rolePermissions[role] || basePermissions;
};

/**
 * Create default admin user (for initial setup)
 */
export const createDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log(
        "ℹ️  Admin users already exist. Skipping default admin creation."
      );
      return;
    }

    await createAdminUser({
      name: "Super Admin",
      email: "admin@trendmart.com",
      password: "Admin@123456",
      role: "super_admin",
    });

    console.log(
      "\n📌 Default admin user created with credentials:"
    );
    console.log("   Email: admin@trendmart.com");
    console.log("   Password: Admin@123456");
    console.log(
      "   ⚠️  Please change this password immediately after first login!"
    );
  } catch (error: any) {
    console.error("❌ Error creating default admin:", error.message);
    throw error;
  }
};

/**
 * Seed demo admin users
 */
export const seedDemoAdmins = async () => {
  const demoAdmins: CreateAdminInput[] = [
    {
      name: "Super Admin User",
      email: "super.admin@trendmart.com",
      password: "SuperAdmin@123",
      role: "super_admin",
    },
    {
      name: "Admin User",
      email: "admin.user@trendmart.com",
      password: "Admin@123",
      role: "admin",
    },
    {
      name: "Moderator User",
      email: "moderator@trendmart.com",
      password: "Moderator@123",
      role: "moderator",
    },
  ];

  console.log("🌱 Seeding demo admin users...\n");
  await createMultipleAdmins(demoAdmins);
};

// Run this script directly
if (require.main === module) {
  (async () => {
    try {
      console.log("🚀 Starting admin user creation...\n");

      // Connect to MongoDB
      const mongoURI =
        process.env.MONGODB_URI || "mongodb://localhost:27017/trendmart";
      console.log("📦 Connecting to MongoDB...");
      await mongoose.connect(mongoURI);
      console.log("✅ Connected to MongoDB\n");

      await createDefaultAdmin();
      console.log("\n✨ Admin setup completed!");

      // Disconnect from database
      await mongoose.disconnect();
      process.exit(0);
    } catch (error) {
      console.error("Failed to setup admin:", error);
      await mongoose.disconnect();
      process.exit(1);
    }
  })();
}

export default {
  createAdminUser,
  createMultipleAdmins,
  createDefaultAdmin,
  seedDemoAdmins,
};
